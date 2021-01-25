// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: Project model classes
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient, HttpHeaders }
	from '@angular/common/http';

import * as _
	from 'lodash';

import { Note, History }
	from '../core.utils';

export class Project {

	_id: string;
	_rev: string;
	type: string;
	name: string;
	descr: string;
	usrAdminList: Array<String>;
	usrAssignList: Array<String>;
	actGrp: string;
	dateStart: Date | null;
	dateEnd: Date | null;
	effortUnit: string;
	effortCap: string | null;
	history: Array<History> = [];
	notes: Array<Note> = [];
	tasks: Array<ProjectTask> = [];

	constructor(d: any) {

		this._id = d._id;
		this._rev = d._rev;
		this.type = d.type;
		this.name = d.name;
		this.descr = d.descr;
		this.usrAdminList = d.usrAdminList;
		this.usrAssignList = d.usrAssignList;
		this.actGrp = d.actGrp;
		this.dateStart = d.dateStart != '' ? new Date(Date.parse(d.dateStart)) : null;
		this.dateEnd = d.dateEnd != '' ? new Date(Date.parse(d.dateEnd)) : null;
		this.effortUnit = d.effortUnit;
		this.effortCap = d.effortCap;
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
			"actGrp": this.actGrp,
			"dateStart": this.dateStart != null ? this.dateStart.toISOString() : '',
			"dateEnd": this.dateEnd != null ? this.dateEnd.toISOString() : '',
			"effortUnit": this.effortUnit,
			"effortCap": this.effortCap
		};
		return JSON.stringify(o);
	}

	static load(projectId: string, http: HttpClient): Promise<Project> {

		return new Promise((resolve, reject) => {
			let objDataUrl: string = `/_data/${projectId}`;
			http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data: any) => {
				if (!data.error)
					resolve(new Project(data));
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

	static create(actGrp: string, usrId: string, http: HttpClient): Promise<Project> {

		return new Promise((resolve, reject) => {
			http.get('/_uuid').subscribe((data: any) => {
				let p = new Project({
					"_id": data.uuid,
					"type": "Project",
					"name": "New project",
					"descr": "",
					"usrAdminList": [usrId],
					"usrAssignList": [usrId],
					"actGrp": actGrp,
					"dateStart": new Date(),
					"dateEnd": '',
					"effortUnit": '0:15', // TODO Shoud be set by general / user preferences
					"effortCap": ''
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

export class ProjectTask {

	_id: string;
	_rev: string;
	type: string;
	summary: string;
	descr: string;
	pc: string;
	dateDue: Date | null;
	created: { "usr": string, "date": Date };
	updated: { "usr": string, "date": Date };
	project: string;
	usrAssignList: Array<string>;

	modified: boolean = false;

	constructor(d: any) {

		// Object from db
		this._id = d._id;
		this._rev = d._rev;
		this.type = d.type;
		this.summary = d.summary;
		this.descr = d.descr;
		this.pc = `${d.pc}`;
		this.dateDue = d.dateDue != '' ? new Date(Date.parse(d.dateDue)) : null;
		this.created = {
			"usr": d.created.usr,
			"date": new Date(Date.parse(d.created.date))
		};
		this.updated = {
			"usr": d.updated.usr,
			"date": new Date(Date.parse(d.updated.date))
		};
		this.project = d.project;
		this.usrAssignList = d.usrAssignList;
	}

	setUpdateInfo(usrId: string) {

		// TODO Maybe shouldn't' udpate for a given time-windoww after task creation (as they're usually inmmediately updated after that and thus is useless info)
		this.updated = {
			"usr": usrId,
			"date": new Date()
		}
	}

	stringify() {

		let o = {
			"_id": this._id,
			"_rev": this._rev,
			"type": this.type,
			"summary": this.summary,
			"descr": this.descr,
			"pc": parseInt(this.pc),
			"dateDue": this.dateDue != null ? this.dateDue.toISOString() : '',
			"created": { "usr": this.created.usr, "date": this.created.date.toISOString() },
			"updated": { "usr": this.updated.usr, "date": this.updated.date.toISOString() },
			"project": this.project,
			"usrAssignList": this.usrAssignList
		};
		return JSON.stringify(o);
	}

	refresh(rev: string) {

		this.modified = false;
		this._rev = rev;
	}

	delete(http: HttpClient): Promise<void> {

		return new Promise((resolve, reject) => {
			let dbObjUrl = `/_data/${this._id}`;
			http.delete(`${dbObjUrl}?rev=${this._rev}`).subscribe((delResp: any) => {
				if (delResp.ok)
					resolve();
				else
					reject(`\uD83D\uDCA3 !!! ${delResp.reason} !!! \uD83D\uDCA3`);
			});
		});
	}

	update(http: HttpClient): Promise<void> {

		return new Promise((resolve, reject) => {
			let dbObjUrl = `/_data/${this._id}`;
			http.put(dbObjUrl, this.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json" }) }).subscribe((putResp: any) => {
				if (putResp.ok) {
					this.refresh(putResp.rev);
					resolve();
				}
				else
					reject(`\uD83D\uDCA3 !!! ${putResp.reason} !!! \uD83D\uDCA3`);
			});
		});
	}

	static create(projectId: string, usrId: string, http: HttpClient): Promise<ProjectTask> {

		return new Promise((resolve, reject) => {
			http.get('/_uuid', { "observe": "body", "responseType": "json" }).subscribe((respUuid: any) => {
				let creationDate: string = new Date().toISOString();
				let t = new ProjectTask({
					"_id": respUuid.uuid,
					"type": "ProjectTask",
					"summary": "New task",
					"descr": "",
					"pc": "0",
					"dateDue": '',
					"created": { "usr": usrId, "date": creationDate },
					"updated": { "usr": usrId, "date": creationDate },
					"project": projectId,
					"usrAssignList": [usrId]
				});
				let dbObjUrl = `/_data/${t._id}`;
				http.put(dbObjUrl, t.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json" }) }).subscribe((putResp: any) => {
					if (putResp.ok) {
						t.refresh(putResp.rev);
						resolve(t);
					}
					else
						reject(`\uD83D\uDCA3 !!! ${putResp.reason} !!! \uD83D\uDCA3`);
				});
			});
		});
	}

	static getFor(projectId: string, http: HttpClient): Promise<Array<ProjectTask>> {

		return new Promise((resolve, reject) => {
			let objDataUrl = `/_data/_design/project/_view/tasks-by-project?key="${projectId}"&include_docs=true`;
			http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data: any) => {
				if (!data.error) {
					let r: Array<ProjectTask> = [];
					_.forEach(data.rows, (row) => {
						r.push(new ProjectTask(row.doc));
					});
					resolve(_.reverse(_.sortBy(r, ['date'])));
				}
				reject(`\uD83D\uDCA3 !!! ${data.reason} !!! \uD83D\uDCA3`);
			});
		});
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
