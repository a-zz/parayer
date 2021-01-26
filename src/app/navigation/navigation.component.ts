// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: NavigationComponent
// Main layout and navigation tools
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { BreakpointObserver } 	
	from '@angular/cdk/layout';
import { Breakpoints }
	from '@angular/cdk/layout';
import { Component }
	from '@angular/core';
import { map }
	from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } 
	from '@angular/material/dialog';
import { MatSnackBar }
	from '@angular/material/snack-bar';
import { Observable }
	from 'rxjs';
import { shareReplay }
	from 'rxjs/operators';

import { AppComponent }
	from '../app.component';
import { CoreService }
	from '../core.services';
import { SimpleConfirmDialogComponent } from './simple-confirm-dialog.component';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

	public locationIcon :string = '';
	public locationTitle: string ='';
	public locationLinks :Array<{"text" :string, "route" :string}>|null = null;
	public waiting :boolean = true;

	isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(
			public _app :AppComponent,
			private _breakpointObserver :BreakpointObserver,
			private _csrv :CoreService,
			private _snackBar :MatSnackBar,
			private _confirm: MatDialog) {
			
	}
		
	showWait(show :boolean) :void {
		
		this.waiting = show;
	}
		
	setLocation(title :string, links :Array<{"text" :string, "route" :string}>|null, icon :string) :void {
		
		// TODO Improve icon-text alignment (and -side-toggle button, when shown)
		this.locationTitle = title;
		this.locationLinks = links;
		this.locationIcon = icon;
	}
	
	showSnackBar(txt :string) :void {
		
		this._snackBar.open(txt, '', { duration: 3000 });
	}
	
	showSimpleConfirmDialog(title :string, message :string, okCallback :()=>void, cancelCallback :()=>void) :MatDialogRef<SimpleConfirmDialogComponent> {
		
		let cfg = new MatDialogConfig();
		cfg.data = { "title": title, "message": message, "okCallback": okCallback, "cancelCallback": cancelCallback };
		return this._confirm.open(SimpleConfirmDialogComponent, cfg);
	}
	
	goHome() :void {
		
		console.log('To be implemented!');
	}
	
	getVersion() :string {
		
		return this._csrv.getVersion();
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
