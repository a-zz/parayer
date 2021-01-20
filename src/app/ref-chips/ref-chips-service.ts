// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: RefChipsService
// Reference chips management service 
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Injectable }
	from '@angular/core';
import { HttpClient } 
	from '@angular/common/http';	

import * as _
	from 'lodash';

@Injectable({ providedIn: 'root' })
export class RefChipsService {
	
	rccache :Array<{ "expiry": number, "data": any }> = [];
	
	constructor(private _http :HttpClient) { }
	
	getFor(id :string) :Promise<any> {
	
		// TODO Set expiry per type (defaults to 10 minutes)
		let expiry = 10 * 60 * 1000;
		let r = new Promise<any>((resolve) => {
			let cached = this.getCached(id);
			if(cached!=null)
				resolve(cached.data);
			else {
				let dbObjUrl = `/_data/${id}`;
				this._http.get(dbObjUrl, { "observe": "body", responseType: "json" }).subscribe((data :any) => {
					// TODO Handle errors properly
					if(!data.error) {
						this.cacheIn(data, expiry);
						resolve(data);
					}
					else
						resolve({ "type": "Error", "reason": data.reason });
				});
			}
		});
		return r;
	}
	
	getCached(id :string) :{ "expiry": number, "data": any }|null {
		
		let cached = _.find(this.rccache, function(o) {
			return o.data._id==id;
		});
		if(cached) {
			if(cached.expiry>=_.now())
				return cached;
			else {
				_.remove(this.rccache, function(o) {
					return o.data._id==id;
				});
				return null;
			}
		}
		else
			return null;
	}
	
	cacheIn(data :any, expiry :number) :void {
		
		_.remove(this.rccache, function(o) {
			return o.data._id==data._id;
		});
		this.rccache.push({ "expiry": _.now() + expiry, "data": data })
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
