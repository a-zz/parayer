// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActGridComponent
// Activity grid (and main) component
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component } 			from '@angular/core';
import { HttpClient } 			from '@angular/common/http';
import { AfterViewChecked } 				from '@angular/core';

import * as _ 					from 'lodash';

import { Core, DateTimeUtil }	from '../core.service';
import { NavigationComponent }	from '../navigation/navigation.component';

@Component({
	selector: 'app-act-grid',
	templateUrl: './act-grid.component.html',
	styleUrls: ['./act-grid.component.css']
})
export class ActGridComponent implements AfterViewChecked {

	myActList :Array<Activity> = []; 
	currentWeek :Array<any>;
	
	constructor(private _http :HttpClient, private _nav: NavigationComponent) { 
		
		this.currentWeek = DateTimeUtil.computeWeek(new Date());
		this.getActivity();
		this._nav.setLocation('My activity', 'table_chart');		
	}
	
	ngAfterViewChecked() :void {
		
		this.fixGridLayout();
	}
	
	getActivity() :void {

		// TODO Response data from db should be typed, although it's guaranteed to be conformant by backend schema	
		let myActList :Array<Activity> = [];
		let usrId = Core.getLoggedUser().id;
		this._http.get(`/_data/_design/activity/_view/activity-area-by-assign-usr?key="${usrId}"`, { "observe": "body", "responseType": "json"}).
			subscribe((actAreasData :any) => { 
				let areas :Array<Activity> = [];
				_.forEach(_.sortBy(actAreasData.rows, ['value.name']), (row :any) => {
					areas.push(new Activity(row));
				});	
				this._http.get(`/_data/_design/activity/_view/activity-group-by-assign-usr?key="${usrId}"`, { "observe": "body", "responseType": "json"}).
					subscribe((actGroupsData :any) => { 
						let groups :Array<Activity> = [];
						_.forEach(_.sortBy(actGroupsData.rows, ['value.name']), (row :any) => {
							groups.push(new Activity(row));
						});	
						this._http.get(`/_data/_design/activity/_view/project-by-assign-usr?key="${usrId}"`, { "observe": "body", "responseType": "json"}).
							subscribe((projectsData :any) => {
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
		/*		
					$scope.$$postDigest(function() {
						// TODO Improve this: there's a flash before grid layout
						$scope.gridLayout();
						document.querySelector('div.mdc-data-table#act-grid-cntnr-main').style.visibility = 'visible';
					});
					parayer.ui.showWait(false);
				});		
			});
		});
		*/
	}
	
	fixGridLayout() {
		
		let sbw = this.getScrollbarWidth();
		let twdth = (document.querySelector('div#act-grid') as HTMLElement)!.offsetWidth;
		//(document.querySelector('div.grid-hourly-slots') as HTMLElement)!.style.width = `${twdth}px`;
		let cols = ['c01','c02', 'c03', 'c04']
		let wdthpc = [.20, .05, .10, .05];
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
	
	// TODO Should be global
	getScrollbarWidth() :number {

		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll'; 
		//outer.style.msOverflowStyle = 'scrollbar'; 
		document.body.appendChild(outer);
		const inner = document.createElement('div');
		outer.appendChild(inner);
		const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
		outer!.parentNode!.removeChild(outer);
		return scrollbarWidth;
	}
}

export class Activity {
			
	id :string; // TODO Define type uuid
	type :string;
	name :string;
	descr :string;
	parent :string|null; // TODO Define type uuid
	url :string; // TODO Should be properly typed, maybe
			
	constructor(d :any) { // TODO d (response data from db) should be typed, although is guaranteed to be conformant by backend schema
		
		this.id = d.id;
		this.type = d.value.type;
		this.name = d.value.name;
		this.descr = d.value.descr;
		switch(d.value.type) {
		case 'ActGrp':
			this.parent = d.value.actArea;
			this.url = `/act-group/${this.id}`;
			break;
		case 'Project':
			this.parent = d.value.actGrp;
			this.url = `/project/${this.id}`;
			break;
		default:
			this.parent = null;
			this.url = `/act-area/${this.id}`;
		} 
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
