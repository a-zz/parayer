// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActGroupComponent
// Activity group tool
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient } 
	from '@angular/common/http';
import { Component } 
	from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } 
	from '@angular/forms';
import { ErrorStateMatcher } 
	from '@angular/material/core';
import { ActivatedRoute, Router } 
	from '@angular/router';

import { History } 
	from '../core.utils';
import { ActGroup } 
	from './act-group.model';
import { NavigationComponent } 
	from '../navigation/navigation.component';
import { ActArea } from '../act-area/act-area.model';

@Component({
	selector: 'app-act-group',
	templateUrl: './act-group.component.html',
	styleUrls: ['./act-group.component.css']
})
export class ActGroupComponent {

	actGroup :ActGroup|null = null;
	fcName :FormControl = new FormControl('', [Validators.required]);
	fcDescr :FormControl = new FormControl('');
	fcDateStart :FormControl = new FormControl('');
	fcDateEnd :FormControl = new FormControl('');
	fcEffortUnit :FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcEffortCap = new FormControl('', [Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcErr :ErrorStateMatcher = new ActGroupErrorStateMatcher();	

	constructor(
			private _route :ActivatedRoute, 
			private _http :HttpClient, 
			private _nav :NavigationComponent,
			private _router :Router) {

		this._nav.showWait(true);
		let projectId = this._route.snapshot.paramMap.get('id'); 
		if(projectId!=null)
			ActGroup.load(projectId, this._http).then((g :ActGroup) => {
				this.actGroup = g;
				this.fcName.setValue(this.actGroup.name);
				this.fcDescr.setValue(this.actGroup.descr);
				ActArea.load(this.actGroup.actArea, this._http).then((a: ActArea) => {
					this._nav.setLocation(`Activity group :: ${a.name} > ${this.actGroup!.name}`, 'view_list');
				});
				this._nav.showWait(false);			
			}, (reason :string) => {
				this._nav.showSnackBar(reason);
				this._nav.showWait(false);						
			});
	}
	
	formIsValid() :boolean {
	
		return !(this.fcErr.isErrorState(this.fcName, null) ||
			this.fcErr.isErrorState(this.fcDescr, null));
	}
	
	save() :void {
		
		if(!this.formIsValid())
			this._nav.showSnackBar('Errors found, can\'t save!');
		else {
			let g = this.actGroup!;
			g.name = this.fcName.value;
			g.descr = this.fcDescr.value;
			g.save(this._http).then(() => {
				History.make(`Updated activity area info`, g._id, null, 60 * 60 * 1000, this._http).then(() => {}, (reason) => {
					this._nav.showSnackBar(reason);
				});
				this._router.navigateByUrl('/act-grid');
			}, (reason) => {
				this._nav.showSnackBar(`Project saving failed! ${reason}`);
			});
		}
	}
}

export class ActGroupErrorStateMatcher implements ErrorStateMatcher {
	
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
