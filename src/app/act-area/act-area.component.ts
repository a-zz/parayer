// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActAreaComponent
// Activity area management tool
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient }
	from '@angular/common/http';
import { Component }
	from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators }
	from '@angular/forms';
import { ActivatedRoute, Router }
	from '@angular/router';

import { ActArea }
	from './act-area.model';
import { NavigationComponent }
	from '../navigation/navigation.component';
import { History } from '../core.utils';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
	selector: 'app-act-area',
	templateUrl: './act-area.component.html',
	styleUrls: ['./act-area.component.css']
})
export class ActAreaComponent {

	actArea :ActArea | null = null;
	fcName :FormControl = new FormControl('', [Validators.required]);
	fcDescr :FormControl = new FormControl('');
	fcDateStart :FormControl = new FormControl('');
	fcDateEnd :FormControl = new FormControl('');
	fcEffortUnit :FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcEffortCap = new FormControl('', [Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcErr :ErrorStateMatcher = new ActAreaErrorStateMatcher();

	constructor(
		private _route: ActivatedRoute,
		private _http: HttpClient,
		private _nav: NavigationComponent,
		private _router: Router) {

		this._nav.showWait(true);
		let projectId = this._route.snapshot.paramMap.get('id');
		if(projectId != null)
			ActArea.load(projectId, this._http).then((a: ActArea) => {
				this.actArea = a;
				this.fcName.setValue(this.actArea.name);
				this.fcDescr.setValue(this.actArea.descr);
				this._nav.setLocation(`Activity area`, [ { "text": this.actArea.name, "route": this.actArea.getRoute() } ], 'view_module');
				this._nav.showWait(false);
			}, (reason: string) => {
				this._nav.showSnackBar(reason);
				this._nav.showWait(false);
			});
	}

	formIsValid(): boolean {

		return !(this.fcErr.isErrorState(this.fcName, null) ||
			this.fcErr.isErrorState(this.fcDescr, null));
	}

	save(): void {

		if(!this.formIsValid())
			this._nav.showSnackBar('Errors found, can\'t save!');
		else {
			let a = this.actArea!;
			a.name = this.fcName.value;
			a.descr = this.fcDescr.value;
			a.save(this._http).then(() => {
				History.make(`Updated activity area info`, a._id, null, 60 * 60 * 1000, this._http).then(() => { }, (reason) => {
					this._nav.showSnackBar(reason);
				});
				this._router.navigateByUrl('/act-grid');
			}, (reason) => {
				this._nav.showSnackBar(`Project saving failed! ${reason}`);
			});
		}
	}
}

export class ActAreaErrorStateMatcher implements ErrorStateMatcher {

	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
