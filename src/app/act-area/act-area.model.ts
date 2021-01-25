// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: Activity area model classes
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient, HttpHeaders }
	from '@angular/common/http';

import * as _
	from 'lodash';

export class ActArea {

	_id: string;
	_rev: string;
	type: string;
	name: string;
	descr: string;
	usrAdminList: Array<String>;
	usrAssignList: Array<String>;

	constructor(d: any) {

		this._id = d._id;
		this._rev = d._rev;
		this.type = d.type;
		this.name = d.name;
		this.descr = d.descr;
		this.usrAdminList = d.usrAdminList;
		this.usrAssignList = d.usrAssignList;
	}

	stringify() {

		let o = {
			"_id": this._id,
			"_rev": this._rev,
			"type": this.type,
			"name": this.name,
			"descr": this.descr,
			"usrAdminList": this.usrAdminList,
			"usrAssignList": this.usrAssignList,
		};
		return JSON.stringify(o);
	}

	static load(projectId: string, http: HttpClient): Promise<ActArea> {

		return new Promise((resolve, reject) => {
			let objDataUrl: string = `/_data/${projectId}`;
			http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data: any) => {
				if (!data.error)
					resolve(new ActArea(data));
				else
					reject(`\uD83D\uDCA3 !!! ${data.reason} !!! \uD83D\uDCA3`);
			});
		});
	}

	save(http: HttpClient): Promise<void> {

		return new Promise((resolve, reject) => {
			let dbObjUrl = `/_data/${this._id}`;
			http.put(dbObjUrl, this.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json" }) })
				.subscribe((putResp: any) => {
					if (putResp.ok) {
						resolve();
					}
					else
						reject(`\uD83D\uDCA3 !!! ${putResp.reason} !!! \uD83D\uDCA3`);
				});
		});
	}

	static create(usrId: string, http: HttpClient): Promise<ActArea> {

		return new Promise((resolve, reject) => {
			http.get('/_uuid').subscribe((data: any) => {
				let p = new ActArea({
					"_id": data.uuid,
					"type": "ActArea",
					"name": "New activity area",
					"descr": "",
					"usrAdminList": [usrId],
					"usrAssignList": [usrId]
				});
				p.save(http).then(() => {
					resolve(p);
				}, (reason) => {
					reject(reason);
				});
			});
		});
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
