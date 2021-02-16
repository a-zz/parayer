// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActTreeComponent
// User activity management
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component, OnDestroy }
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
export class ActTreeComponent implements OnDestroy {

	treeControl = new NestedTreeControl<Activity>(node => node.children);
	dataSource = new MatTreeNestedDataSource<Activity>();

	constructor(private _http :HttpClient, private _nav: NavigationComponent, private _router :Router) {
		
		this._nav.showWait(true);
		this._nav.setLocation('My activity', 'account_tree');
		Activity.getAll(UserService.getLoggedUser().id, _http).then((data :Array<Activity>) => {
			this.dataSource.data = data;
			this._nav.showWait(false);
		}, (reason :string) => {
			this._nav.showSnackBar(reason);
			this._nav.showWait(false);
		});
	}

	hasChild = (_: number, node: Activity) => !!node.children && node.children.length > 0;
	
	ngOnDestroy() :void {
		
		// TODO Save current tree status 
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
	children :Array<Activity>|null;
	url :string|null; 
			
	constructor(d :any) {
		
		this.id = d.id;
		this.type = d.value.type;
		this.name = d.value.name;
		this.descr = d.value.descr;
		switch(d.value.type) {
		case 'ActArea':
			this.parent = null;
			this.children = [];
			this.url = `act-area`;
			break;
		case 'ActGrp':
			this.parent = d.value.actArea;
			this.children = [];
			this.url = `act-group`;
			break;
		case 'Project':
			this.parent = d.value.actGrp;
			this.children = null;
			this.url = `project`;
			break;
		default:
			this.parent = null;
			this.children = null;
			this.url = null;
		} 
	}
	
	static getAll(usrId :string, http :HttpClient) :Promise<Array<Activity>> {
		
		return new Promise((resolve, reject) => {
			http.get(`/_data/_design/activity/_view/activity-area-by-assign-usr?key="${usrId}"`, 
			{ "observe": "body", "responseType": "json"}).subscribe((actAreasData :any) => {
				if(!actAreasData.error) { 
					let activities :Array<Activity> = [];
					_.forEach(_.sortBy(actAreasData.rows, ['value.name']), (row :any) => {
						activities.push(new Activity(row));
					});
					http.get(`/_data/_design/activity/_view/activity-group-by-assign-usr?key="${usrId}"`, 
					{ "observe": "body", "responseType": "json"}).subscribe((actGroupsData :any) => {
						if(!actGroupsData.error) {
							_.forEach(_.sortBy(actGroupsData.rows, ['value.name']), (row :any) => {
								let group = new Activity(row);
								_.find(activities, (a :Activity) => a.id==group.parent)!.children!.push(group);								
							});
							http.get(`/_data/_design/activity/_view/project-by-assign-usr?key="${usrId}"`, 
							{ "observe": "body", "responseType": "json"}).subscribe((projectsData :any) => {
								_.forEach(_.sortBy(projectsData.rows, ['value.name']), (row :any) => {
									let project = new Activity(row);
									_.forEach(activities, (area :Activity) => {
										if(area.children!=null) {
											let g = _.find(area.children, (g :Activity) => g.id==project.parent);
											if(g!=undefined && g.children!=null)
												g.children!.push(project);
										}
									})
								});
								resolve(activities);
							});
						}
						else
							reject(actGroupsData.reason);
					});
				}
				else
					reject(actAreasData.reason); 	
			});
		});
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
