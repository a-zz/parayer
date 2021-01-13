// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActGridComponent
// My account (user info) management
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// TODO Method contracts missing
import { BreakpointObserver } 	from '@angular/cdk/layout';
import { Breakpoints } 			from '@angular/cdk/layout';
import { Component } 			from '@angular/core';
import { map } 					from 'rxjs/operators';
import { MatSnackBar } 			from '@angular/material/snack-bar';
import { Observable } 			from 'rxjs';
import { shareReplay } 			from 'rxjs/operators';

import { AppComponent}			from '../app.component';
import { Core }					from '../core.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

	public _locationIcon :string = '';
	public _locationText :string = '';
	public _waiting :boolean = true;

	isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(
			public _app :AppComponent,
			private _breakpointObserver :BreakpointObserver,
			private _snackBar :MatSnackBar) {
				 
	}
		
	showWait(show :boolean) :void {
		
		this._waiting = show;
	}
	
	setLocation(text :string, icon :string) :void {
		
		// TODO Improve icon-text alignment (and -side-toggle button, when shown)
		this._locationText = text;
		this._locationIcon = icon;
	}
	
	showSnackBar(txt :string) :void {
		
		this._snackBar.open(txt, '', { duration: 3000 });
	}
	
	showSimpleConfirmDialog(innerHTML :string, okCallback :()=>void, cancelCallBack :()=>void) {
		
		console.log('To be implemented!');
	}
	
	goHome() :void {
		
		console.log('To be implemented!');
	}
	
	getVersion() :string {
		
		return Core.getVersion();
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
