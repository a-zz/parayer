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

@Injectable({ providedIn: 'root' })
export class RefChipsService {
	
	rccache :Array<{ "expiry": number, "data": any }> = [];
	
	constructor() { }
	
	// TODO Add click event on chips and redirect accordingly (not so immediate if relatedTo) 
	fillInAll(http :HttpClient) {
		
		let self = this;
		let chips = document.querySelectorAll(".refchip");
		_.forEach(chips, function(chip) {
			let cached = self.getCached(chip.id);
			if(cached)
				self.fillIn(chip as HTMLElement, cached.data);
			else {
				let dbObjUrl = `/_data/${chip.id}`;
				http.get(dbObjUrl, { "observe": "body", responseType: "json" }).subscribe((data :any) => {
					// TODO Handle errors properly
					if(!data.error) {
						self.fillIn(chip as HTMLElement, data);
						self.cacheIn(data);
					}
					else
						self.fillIn(chip as HTMLElement, { "type": "error", "reason": `(${data.reason})` });
				});
			}
		});
	}
	
	getCached(_id :string) :{ "expiry": number, "data": any }|null {
		
		let cached = _.find(this.rccache, function(o) {
			return o.data._id==_id;
		});
		if(cached) {
			if(cached.expiry>=_.now())
				return cached;
			else {
				_.remove(this.rccache, function(o) {
					return o.data._id==_id;
				});
				return null;
			}
		}
		else
			return null;
	}
	
	cacheIn(data :any) :void {
		
		_.remove(this.rccache, function(o) {
			return o.data._id==data._id;
		});
		let expiry = _.now();
		switch(data.type) {
			case "Note":
			case "ProjectTask":
				expiry += 10 * 60 * 1000; // 10 minutes
				break;
			default:
				expiry += 60 * 60 * 1000; // default: 1 hour 
		}
		this.rccache.push({ "expiry": expiry, "data": data })
	}
		
	// FIXME Method contract missing
	fillIn(chip :HTMLElement, data :any) :void {
		
		switch(data.type) {
		case "Usr":
			chip.innerHTML = data.email;
			break;
		case "Note":
		case "ProjectTask":
			chip.innerHTML = data.summary;
			break;
		case "error":
			chip.innerHTML = data.reason;
			break;
		default:
			chip.innerHTML = '???';
		}
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
