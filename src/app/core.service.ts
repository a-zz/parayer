// TODO Code cleanup, method contracts, etc.
//import { HttpClient }	from '@angular/common/http';
import { Injectable } 	from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Core {
	
	// TODO Test code
	static getVersion() :string {
		
		// TODO Find out how to load version info statically from /_info backend service
		return '0.0.0';
	}
		
	static getLoggedUser() :User {
		
		return new User();
	} 
}

export class User {

	// TODO Test code
	public id :string = '36020490-2534-3d92-386f-90135b000f1e';
}