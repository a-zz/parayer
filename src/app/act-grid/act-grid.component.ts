// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActGridComponent
// Activity grid (and main) component
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient }
	from '@angular/common/http';
import { AfterContentChecked, Component } 	
	from '@angular/core';

import * as _ 					from 'lodash';

import { UserService } from '../core.services';
import { DateTimeUtil, UI } from '../core.utils';
import { NavigationComponent }	from '../navigation/navigation.component';

@Component({
	selector: 'app-act-grid',
	templateUrl: './act-grid.component.html',
	styleUrls: ['./act-grid.component.css']
})
export class ActGridComponent implements AfterContentChecked {

	myActList :Array<Activity> = []; 
	currentWeek :Array<any>;
	
	constructor(private _http :HttpClient, private _nav :NavigationComponent) { 
		
		this._nav.showWait(true);
		this.currentWeek = DateTimeUtil.computeWeek(new Date());
		this.getActivity();
		this._nav.setLocation('My activity', 'table_chart');		
		window.addEventListener('resize', this.fixGridLayout);
		// TODO Remove event listener when leaving view
	}
	
	ngAfterContentChecked() :void {
		
		this.fixGridLayout();
	}
	
	getActivity() :void {

		// TODO Perhaps response data from db should be typed, although it's guaranteed to be conformant by backend schema	
		// TODO As per the manual, data-fetching should be done by a specific service
		let myActList :Array<Activity> = [];
		let usrId = UserService.getLoggedUser().id;
		this._http.get(`/_data/_design/activity/_view/activity-area-by-assign-usr?key="${usrId}"`, 
			{ "observe": "body", "responseType": "json"}).subscribe((actAreasData :any) => { 
				let areas :Array<Activity> = [];
				_.forEach(_.sortBy(actAreasData.rows, ['value.name']), (row :any) => {
					areas.push(new Activity(row));
				});	
				this._http.get(`/_data/_design/activity/_view/activity-group-by-assign-usr?key="${usrId}"`, 
					{ "observe": "body", "responseType": "json"}).subscribe((actGroupsData :any) => { 
						let groups :Array<Activity> = [];
						_.forEach(_.sortBy(actGroupsData.rows, ['value.name']), (row :any) => {
							groups.push(new Activity(row));
						});	
						this._http.get(`/_data/_design/activity/_view/project-by-assign-usr?key="${usrId}"`, 
							{ "observe": "body", "responseType": "json"}).subscribe((projectsData :any) => {
								let projects :Array<Activity> = [];
								_.forEach(_.sortBy(projectsData.rows, ['value.name']), function(row :any) {
									projects.push(new Activity(row));
								});
								_.forEach(areas, function(a :Activity) {
									//$scope.areas.push(a);
									myActList.push(a);
									_.forEach(_.filter(groups, function(g :Activity) {
										return g.parent==a.id;
									}), function(g :Activity) {
										//$scope.groups.push(g);
										myActList.push(g);
										_.forEach(_.filter(projects, function(p :Activity) {
											return p.parent==g.id;
										}), function(p :Activity) {
											//$scope.projects.push(p);
											myActList.push(p);
										})
									});
								});	
								this.myActList = myActList;
								this._nav.showWait(false);
							});
					});
			});
	}
	
	fixGridLayout() {
		
		// TODO Responsive layout for handsets required
		let sbw = UI.getScrollbarWidth();
		let twdth = (document.querySelector('div#act-grid') as HTMLElement)!.offsetWidth;
		//(document.querySelector('div.grid-hourly-slots') as HTMLElement)!.style.width = `${twdth}px`;
		let cols = ['c01','c02', 'c03', 'c04']
		let wdthpc = [.15, .04, .11, .04];
		for(let i = 0; i<cols.length; i++) {
			_.forEach(document.querySelectorAll(`.${cols[i]}`), (o :Element) => {
				let c = (o as HTMLElement);
				c.style.width = `${(wdthpc[i]*twdth)}px`;
				c.style.maxWidth = `${(wdthpc[i]*twdth)}px`;
				if(_.indexOf(c.classList, 'sbph')!=-1)
					c.style.paddingRight = `${sbw}px`;
			});
		}
	}
}

export class Activity {
			
	id :string;
	type :string;
	name :string;
	descr :string;
	parent :string|null;
	url :string; 
			
	constructor(d :any) { // TODO Perhaps d (response data from db) should be typed, although is guaranteed to be conformant by backend schema
		
		this.id = d.id;
		this.type = d.value.type;
		this.name = d.value.name;
		this.descr = d.value.descr;
		switch(d.value.type) {
		case 'ActGrp':
			this.parent = d.value.actArea;
			this.url = `act-group`;
			break;
		case 'Project':
			this.parent = d.value.actGrp;
			this.url = `project`;
			break;
		default:
			this.parent = null;
			this.url = `act-area`;
		} 
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
