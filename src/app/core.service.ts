// TODO Code cleanup, method contracts, etc.
//import { HttpClient }	from '@angular/common/http';
import { Injectable } 	from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Core {
	
	public static _version :string = '0.0.0';
	
	// TODO Find out how to load _version statically from /_info backend service
}
