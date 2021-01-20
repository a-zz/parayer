// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: Core service
// App global-scope service and utilities
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient } 				from '@angular/common/http';
import { Injectable }				from '@angular/core';

import * as _ 						from 'lodash';
 
@Injectable({ "providedIn": 'root' })
export class CoreService {

	version :string = '?.?.?';
	
	constructor(private _http :HttpClient) {
		
		this._http.get('/_info', { "observe": "body", "responseType": "json"}).subscribe((data :any) => {
			this.version = data.version;
		});
	}

	getVersion(): string {

		return this.version;
	}
}

export class User {

	// TODO Test code
	public id: string = '36020490-2534-3d92-386f-90135b000f1e';
}

@Injectable({ providedIn: 'root' })
export class UserService {
	
	static getLoggedUser() :User {
		
		// TODO Test code
		return new User();
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
