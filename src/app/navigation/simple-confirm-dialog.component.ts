// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: SimpleConfirmDialogComponent
// General purpose confirm (ok / cancel) dialog
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-confirm-dialog',
  templateUrl: './simple-confirm-dialog.component.html',
  styleUrls: ['./simple-confirm-dialog.component.css']
})
export class SimpleConfirmDialogComponent {

	data :SimpleConfirmDialogData;
	constructor(@Inject(MAT_DIALOG_DATA) public _opts :SimpleConfirmDialogData, private _self :MatDialogRef<SimpleConfirmDialogComponent>) {

		this.data = _opts;
	}
	
	ok() :void {
		
		this._self.close();
		this.data.okCallback();
	}
	
	cancel() :void {
		
		this._self.close();
		if(this.data.cancelCallback!=null)
			this.data.cancelCallback();
	}
	
	@HostListener("keydown.esc") 
	public onEsc() {
		
		this.cancel();
	}
}

export interface SimpleConfirmDialogData {
	
	title :string;
	message :string; // TODO Maybe should be typed as InnerHTML
	okCallback :()=>void;
	cancelCallback :()=>void|null;
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
