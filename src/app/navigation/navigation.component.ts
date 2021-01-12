// TODO Code cleanup, method contracts, etc.
import { AppComponent}	from '../app.component';
import { BreakpointObserver } 	from '@angular/cdk/layout';
import { Breakpoints } 			from '@angular/cdk/layout';
import { Component } 			from '@angular/core';
import { map } 					from 'rxjs/operators';
import { Observable } 			from 'rxjs';
import { shareReplay } 			from 'rxjs/operators';
import { MatSnackBar } 			from '@angular/material/snack-bar';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

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
	
	ngOnInit() {

	}
	
	showWait(show :boolean) :void {
		
		(document.querySelector('#nav-wait-icon') as HTMLElement)!.style.display = show?'inline':'none';
	}
	
	setLocation(loctxt :string) :void {
		
		document.querySelector('#nav-location')!.innerHTML = loctxt;
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
}
