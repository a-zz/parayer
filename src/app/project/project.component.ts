// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ProjectComponent
// Project management tool
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ActivatedRoute }		from '@angular/router';
import { AfterContentChecked } 	from '@angular/core';
import { AfterViewChecked } 	from '@angular/core';
import { Component } 			from '@angular/core';
import { HttpClient } 			from '@angular/common/http';

import { History }				from '../core.utils'
import { RefChipsService }		from '../core.services'
import { NavigationComponent } 	from '../navigation/navigation.component';

@Component({
	selector: 'app-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.css']
})
export class ProjectComponent implements AfterViewChecked, AfterContentChecked {

	project :Project|null = null;

	constructor(
			private _route :ActivatedRoute, 
			private _http :HttpClient, 
			private _nav :NavigationComponent, 
			private _rch :RefChipsService) {

		let objDataUrl :string = `/_data/${this._route.snapshot.paramMap.get('id')}`;
		this._http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data) => {
			this.project = new Project(data);
			this._nav.setLocation(`Project :: ${this.project.name}`, 'map');
			this._nav.showWait(false);
		});
	}

	ngAfterViewChecked(): void {
	
		this.loadTabContent(0);		
	}
	
	ngAfterContentChecked() :void {
		
		this._rch.fillInAll(this._http);
	}

	loadTabContent(i :number) : void {
		
		switch(i) {
		case 1:		// -- Notes --
			console.log('Notes - To be implemented!')
			break;
		case 2:		// -- Tasks --
			console.log('Tasks - To be implemented!')
			break;
		case 3:		// -- Files --
			console.log('Files - To be implemented!')
			break;
		case 4:		// -- Appointments --
			console.log('Appointments - To be implemented!')
			break;
		case 5:		// -- Histoy --
			if(this.project!=null) {
				let self = this;
				this._nav.showWait(true);
				History.getFor(this.project._id, this._http).then(function(h) {
					//this.computeHistoryDateFilters(h);
					self.project!.history = h;
					self._rch.fillInAll(self._http);				
					/*$scope.$$postDigest(function() {
						parayer.refchips.fillInAll($http);
					});
					$scope.$apply(); // TODO Why is this necessary???*/
					self._nav.showWait(false);
				});
			}
			break;
		default:	// -- General --
	
		}
	}
}

export class Project { // TODO Perhaps d (response data from db) should be typed, although is guaranteed to be conformant by backend schema
		
		_id :string;
		_rev : string;
		type :string;
		name :string;
		descr :string;
		usrAdminList :Array<String>;
		usrAssignList :Array<String>;
		actGrp :string;
		dateStart :Date|null;
		dateEnd :Date|null;
		effortUnit :string;
		effortCap :string|null;
		history :Array<History> = [];
		
		constructor(d :any) {
			
			this._id = d._id;
			this._rev = d._rev;
			this.type = d.type;
			this.name = d.name;
  			this.descr = d.descr;
			this.usrAdminList = d.usrAdminList;
			this.usrAssignList = d.usrAssignList;
			this.actGrp = d.actGrp;
			this.dateStart = d.dateStart!=''?new Date(Date.parse(d.dateStart)):null;
			this.dateEnd = d.dateEnd!=''?new Date(Date.parse(d.dateEnd)):null;
			this.effortUnit = d.effortUnit;
			this.effortCap = d.effortCap;
		}
		
		stringify() {
		
			 let o = {
				"_id": this._id,
				"_rev": this._rev,
				"type": this.type,
				"name": this.name,
	  			"descr": this.descr,
				"usrAdminList": this.usrAdminList,
				"usrAssignList": this.usrAssignList,
				"actGrp": this.actGrp,
				"dateStart": this.dateStart!=null?this.dateStart.toISOString():'',
				"dateEnd": this.dateEnd!=null?this.dateEnd.toISOString():'',
				"effortUnit": this.effortUnit,
	  			"effortCap": this.effortCap
			}; 
            return JSON.stringify(o);
		}
		
		refresh(rev :string) {
			
			this._rev = rev;	
		}
	}
	
/*    class VProjectTask {
	
        constructor(d) {
	
            if (typeof(d)==='object') {
				// Object from db
                this._id = d._id;
                this._rev = d._rev;
				this.type = d.type;
                this.summary = d.summary;
                this.descr = d.descr;
                this.pc = `${d.pc}`;
                this.dateDue = d.dateDue!=''?new Date(Date.parse(d.dateDue)):null;
                this.created = {
                    "usr": d.created.usr,
                    "date": new Date(Date.parse(d.created.date))
                };
                this.updated = {
                	"usr": d.updated.usr,
                    "date": new Date(Date.parse(d.updated.date))
                };
                this.project = $scope.project._id;
                this.usrAssignList = d.usrAssignList;
            }
            else {
                // New project task
				let now = new Date();
                this._id = d;
                this.type = 'ProjectTask';
                this.summary = 'New task';
                this.descr = '';
                this.pc = '0';
                this.dateDue = null;
                this.created = { "usr": parayer.auth.getUsrId(), "date": now };
                this.updated = { "usr": parayer.auth.getUsrId(), "date": now };
                this.project = $scope.project._id;
                this.usrAssignList = [parayer.auth.getUsrId()];
            }
		}

		setUpdateInfo() {
				
			// TODO Maybe shouldn't' udpate for a given time-windoww after task creation (as they're usually inmmediately updated after that and thus is useless info)
			this.updated = {
				"usr": parayer.auth.getUsrId(),
				"date": new Date()
			}				
		}

        stringify() {
	
            let o = {
                "_id": this._id,
				"_rev": this._rev,
                "type": this.type,
                "summary": this.summary,
                "descr": this.descr,
                "pc": parseInt(this.pc),
                "dateDue": this.dateDue != null ? this.dateDue.toISOString() : '',
                "created": { "usr": this.created.usr, "date": this.created.date.toISOString() },
                "updated": { "usr": this.updated.usr, "date": this.updated.date.toISOString() },
                "project": this.project,
                "usrAssignList": this.usrAssignList
            };
            return JSON.stringify(o);
        }

		refresh(rev) {
				
			this.changed = false;
			this._rev = rev;
		}
    }*/
// -------------------------------------------------------------------------------------------------------------------------------------------------------------