// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ProjectComponent
// Project management tool
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient, HttpHeaders } 
	from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, Component }
	from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } 
	from '@angular/forms';
import { ErrorStateMatcher } 
	from '@angular/material/core';	
import { ActivatedRoute, Router }
	from '@angular/router';	
			
import * as _ 						
	from 'lodash';

import { RefChipsService }
	from '../core.services';
import { DateTimeUtil, History }
	from '../core.utils';
import { NavigationComponent }
	from '../navigation/navigation.component';

@Component({
	selector:		'app-project',
	templateUrl: 	'./project.component.html',
	styleUrls: 		['./project.component.css']
})
export class ProjectComponent implements AfterViewChecked, AfterContentChecked {
	
	project :Project|null = null;

	constructor(
			private _route :ActivatedRoute, 
			private _http :HttpClient, 
			private _nav :NavigationComponent, 
			private _rch :RefChipsService,
			private _router :Router) {

		this._nav.showWait(true);
		let objDataUrl :string = `/_data/${this._route.snapshot.paramMap.get('id')}`;
		this._http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data) => {
			this.project = new Project(data);
			this.fcName.setValue(this.project.name);
			this.fcDescr.setValue(this.project.descr);
			this.fcDateStart.setValue(this.project.dateStart);
			this.fcDateEnd.setValue(this.project.dateEnd);
			this.fcEffortUnit.setValue(this.project.effortUnit);
			this.fcEffortCap.setValue(this.project.effortCap);
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
					self.project!.history = h;
					self.computeHistoryDateFilters();				
					self._nav.showWait(false);
				});
			}
			break;
		default:	// -- General --
	
		}
	}
	
	// -- GENERAL tab --
	fcName :FormControl = new FormControl('', [Validators.required]);;
	fcDescr :FormControl = new FormControl('');
	fcDateStart :FormControl = new FormControl('');
	fcDateEnd :FormControl = new FormControl('');
	fcEffortUnit :FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcEffortCap = new FormControl('', [Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcErr :ErrorStateMatcher = new ProjectFormErrorStateMatcher();	
	
	formIsValid() :boolean {
	
		return !(this.fcErr.isErrorState(this.fcName, null) ||
			this.fcErr.isErrorState(this.fcDescr, null) ||
			this.fcErr.isErrorState(this.fcDateStart, null) ||
			this.fcErr.isErrorState(this.fcDateEnd, null) ||
			this.fcErr.isErrorState(this.fcEffortUnit, null) ||
			this.fcErr.isErrorState(this.fcEffortCap, null));
	}
	
	save() :void {
		
		if(!this.formIsValid())
			this._nav.showSnackBar('Errors found, can\'t save!');
		else {
			let p = this.project!;
			p.name = this.fcName.value;
			p.descr = this.fcDescr.value;
			p.dateStart = this.fcDateStart.value;
			p.dateEnd = this.fcDateEnd.value;
			p.effortUnit = this.fcEffortUnit.value;
			p.effortCap = this.fcEffortCap.value;
			let dbObjUrl = `/_data/${p._id}`; 
			// TODO Figure out how to parse errors
			this._http.put(dbObjUrl, p.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json"})})
				.subscribe((putResp :any) => {
				if(putResp.ok) {
					History.make(`Updated project info`, p._id, null, 60 * 60 * 1000, this._http, this._nav);
					this._router.navigateByUrl('/act-grid');
				}
				else
					this._nav.showSnackBar(`Oops! ${putResp.reason}`); 
			});
		}
	}
	
	// -- NOTES tab --
	
	// -- TASKS tab --
	
	// -- FILES tab --
	
	// -- APPOINTMENTS tab --
	
	// -- HISTORY tab -- 
	historyTextFilter :string = '';
	historyDateFilter :string = '';
	historyDateFilterOptions :Array<{"value": string, "text": string, order: number}> = [];
	historyFilteredOutEntries :number = 0;
	
	setHistoryTextFilter(e :Event) :void {
	
		this.historyTextFilter = (e.target as HTMLInputElement).value;
	}
	
	filterHistory() :void {
		
		// TODO Text filter should also work on refchips content
		this.historyFilteredOutEntries = 0;
		let textFilter = this.historyTextFilter.toUpperCase();
		if(this.project!=null && this.project.history!=null) {
			let self = this;
			_.forEach(this.project.history, function(h) {
				let entryCntnr = document.querySelector(`#project-hist-entry-${h._id}`) as HTMLElement;
				if(h.summary.toUpperCase().indexOf(textFilter)!=-1 &&
						(self.historyDateFilter=='' || h.dateFilterLabels.indexOf(self.historyDateFilter)!=-1))
					entryCntnr.style.display = '';
				else {
					entryCntnr.style.display = 'none';
					self.historyFilteredOutEntries++;
				}
			});
		}
	}
	
	computeHistoryDateFilters() :void {
		
		let self = this;
		let filtersAdded :Array<string> = []; 
		this.historyDateFilterOptions = [];
		this.historyDateFilterOptions.push({"value": "", "text": "At any time", order: 999})
		_.forEach(this.project?.history, function(h :any) {
			h .dateFilterLabels = [];
			if(DateTimeUtil.isToday(h.timestamp)) {
				h.dateFilterLabels.push('today');
				if(filtersAdded.indexOf('today')==-1) {
					filtersAdded.push('today');
					self.historyDateFilterOptions.push({"value": "today", "text": "Today", order: 0});
				}
			}
			if(DateTimeUtil.isYesterday(h.timestamp)) {
				h.dateFilterLabels.push('yesterday');
				if(filtersAdded.indexOf('yesterday')==-1) {
					filtersAdded.push('yesterday');
					self.historyDateFilterOptions.push({"value": "yesterday", "text": "Yesterday", order: -1});
				}
			}
			if(DateTimeUtil.isThisWeek(h.timestamp)) {
				h.dateFilterLabels.push('thisweek');
				if(filtersAdded.indexOf('thisweek')==-1) {
					filtersAdded.push('thisweek');
					self.historyDateFilterOptions.push({"value": "thisweek", "text": "This week", order: -7});
				}
			}
			if(DateTimeUtil.isLastWeek(h.timestamp)) {
				h.dateFilterLabels.push('lastweek');
				if(filtersAdded.indexOf('lastweek')==-1) {
					filtersAdded.push('lastweek');
					self.historyDateFilterOptions.push({"value": "lastweek", "text": "Last week", order: -14});
				}
			}
			if(DateTimeUtil.isThisMonth(h.timestamp)) {
				h.dateFilterLabels.push('thismonth');
				if(filtersAdded.indexOf('thismonth')==-1) {
					filtersAdded.push('thismonth');
					self.historyDateFilterOptions.push({"value": "thismonth", "text": "This month", order: -30});
				}
			}
			if(DateTimeUtil.isLastMonth(h.timestamp)) {
				h.dateFilterLabels.push('lastmonth');
				if(filtersAdded.indexOf('lastmonth')==-1) {
					filtersAdded.push('lastmonth');
					self.historyDateFilterOptions.push({"value": "lastmonth", "text": "Last month", order: -60});
				}
			}
			if(h.dateFilterLabels.length==0) { 
				let label = `${h.timestamp.getFullYear()}-${String(h.timestamp.getMonth()+1).padStart(2, '0')}`;
				h.dateFilterLabels.push(label);
				if(filtersAdded.indexOf(label)==-1) {
					filtersAdded.push(label);
					// TODO "year-month" in current locale needed for text field
					self.historyDateFilterOptions.push({"value": label, "text": label, order: -90});
				}
			}
			self.historyDateFilterOptions = _.reverse(_.sortBy(self.historyDateFilterOptions, ['order', 'value']));		
		});		
	}	
}

export class ProjectFormErrorStateMatcher implements ErrorStateMatcher {
	
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		
		const isSubmitted = form && form.submitted;
    	return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  	}
}

export class Project { 
		
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
// -------------------------------------------------------------------------------------------------------------------------------------------------------------