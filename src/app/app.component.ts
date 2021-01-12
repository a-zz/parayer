// TODO Code cleanup, method contracts, etc.
import { Component } 			from '@angular/core';
import { HttpClient }			from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	
	public _version :string = '?.?.?';
	
	constructor(private _http :HttpClient) { 
		
		// FIXME Runs in every view change (and shouldn't) (maybe static should do the trick)
		let self = this;
		this._http.get('/_info', {observe: 'body', responseType: 'json'}).subscribe((info :any) => {
			self._version = info.version;
		});
	}
}
