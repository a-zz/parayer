// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActGridComponent
// Activity grid (and main) component
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component } 			from '@angular/core';
import { HttpClient } 			from '@angular/common/http';
import { OnInit } 				from '@angular/core';

import * as _ 					from 'lodash';

import { Core }					from '../core.service';
import { NavigationComponent }	from '../navigation/navigation.component';

@Component({
	selector: 'app-act-grid',
	templateUrl: './act-grid.component.html',
	styleUrls: ['./act-grid.component.css']
})
export class ActGridComponent implements OnInit {

	myActList :Array<Activity> = []; 
	gridData : Array<any> = [];
	
	constructor(private _http :HttpClient, private _nav: NavigationComponent) { 
		
		this._nav.setLocation('My activity', 'table_chart');
		this.getActivity();
	}
		
	ngOnInit() :void {

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
								// TODO Test code
								this.gridData = [
									{ "activity": myActList[0].name, "precol": "", "moncol": "0:00", "tuecol": "0:00", "wedcol": "0:00", "thucol": "0:00", "fricol": "0:00", "satcol": "0:00", "suncol": "0:00", "postcol": "0:00" },
									{ "activity": myActList[1].name, "precol": "", "moncol": "0:00", "tuecol": "0:00", "wedcol": "0:00", "thucol": "0:00", "fricol": "0:00", "satcol": "0:00", "suncol": "0:00", "postcol": "0:00" },
									{ "activity": myActList[2].name, "precol": "", "moncol": "0:00", "tuecol": "0:00", "wedcol": "0:00", "thucol": "0:00", "fricol": "0:00", "satcol": "0:00", "suncol": "0:00", "postcol": "0:00" }
								];
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
	
	// TODO Test code
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;	
}

export class Activity {
			
	id :string; // TODO Define type uuid
	type :string;
	name :string;
	descr :string;
	parent :string|null; // TODO Define type uuid
			
	constructor(d :any) { // TODO d (response data from db) should be typed, although is guaranteed to be conformant by backend schema
		
		this.id = d.id;
		this.type = d.value.type;
		this.name = d.value.name;
		this.descr = d.value.descr;
		switch(d.value.type) {
		case 'ActGrp':
			this.parent = d.value.actArea;
			break;
		case 'Project':
			this.parent = d.value.actGrp;
			break;
		default:
			this.parent = null;
		} 
	}
}

// TODO Test code
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
