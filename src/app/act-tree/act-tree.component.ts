// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActTreeComponent
// User activity management
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component }
	from '@angular/core';
import { HttpClient } 
	from '@angular/common/http';
import { NestedTreeControl }
	from '@angular/cdk/tree';
import { MatTreeNestedDataSource }
	from '@angular/material/tree';
import { Router } 
	from '@angular/router';

import * as _
	from 'lodash';

import { ActArea } 
	from '../act-area/act-area.model';
import { ActGroup } 
	from '../act-group/act-group.model';
import { UserService } 
	from '../core.services';	
import { History } 
	from '../core.utils';
import { NavigationComponent }
	from '../navigation/navigation.component';
import { Project } 
	from '../project/project.model';

@Component({
	selector: 'app-act-tree',
	templateUrl: './act-tree.component.html',
	styleUrls: ['./act-tree.component.css']
})
export class ActTreeComponent {

	myActList :Array<Activity> = [];
	// TODO Test code
	treeControl = new NestedTreeControl<FoodNode>(node => node.children);
	dataSource = new MatTreeNestedDataSource<FoodNode>();

	constructor(private _http :HttpClient, private _nav: NavigationComponent, private _router :Router) {
		
		this._nav.showWait(true);
		this.dataSource.data = TREE_DATA;
		this._nav.setLocation('My activity', 'account_tree');
		this._nav.showWait(false);
	}

	hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
	
	getActivity() :void {
	
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
		
	createActArea() :void {
		
		ActArea.create(UserService.getLoggedUser().id, this._http).then((a) => {
			History.make(`Created new activity group`, a._id, null, null, this._http); 
			this._router.navigateByUrl(`/act-area/${a._id}`);
		}, (reason) => {
			this._nav.showSnackBar(`Activity area creation failed: ${reason}`);
		});
	}
	
	createActGrp(actAreaId :string) :void {
		
		ActGroup.create(actAreaId, UserService.getLoggedUser().id, this._http).then((g) => {
			History.make(`Created new activity group`, g._id, null, null, this._http); 
			this._router.navigateByUrl(`/act-group/${g._id}`);
		}, (reason) => {
			this._nav.showSnackBar(`Activity group creation failed: ${reason}`);
		});	
	}
	
	createProject(actGrpId :string) :void {
		
		Project.create(actGrpId, UserService.getLoggedUser().id, this._http).then((p) => {
			History.make(`Created new project`, p._id, null, null, this._http); 
			this._router.navigateByUrl(`/project/${p._id}`);
		}, (reason) => {
			this._nav.showSnackBar(`Project creation failed: ${reason}`);
		});
	}
}

export class Activity {
			
	id :string;
	type :string;
	name :string;
	descr :string;
	parent :string|null;
	url :string; 
			
	constructor(d :any) {
		
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

/** TODO Test code
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
	name: string;
	children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
	{
		name: 'Fruit',
		children: [
			{ name: 'Apple' },
			{ name: 'Banana' },
			{ name: 'Fruit loops' },
		]
	}, {
		name: 'Vegetables',
		children: [
			{
				name: 'Green',
				children: [
					{ name: 'Broccoli' },
					{ name: 'Brussels sprouts' },
				]
			}, {
				name: 'Orange',
				children: [
					{ name: 'Pumpkins' },
					{ name: 'Carrots' },
				]
			},
		]
	},
];
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
