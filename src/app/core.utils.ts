// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: Core utils
// App global-scope utilities
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient, HttpHeaders } 				
	from '@angular/common/http';

import * as _ 						
	from 'lodash';

import { UserService }				
	from './core.services'

export class DateTimeUtil {

	static computeWeek(selectedDate: Date) :Array<any> {

		let week = [];
		for (let d = 1 - selectedDate.getDay(); d <= 7 - selectedDate.getDay(); d++) {
			let date = new Date(selectedDate);
			date.setDate(date.getDate() + d);
			week.push({
				"d": date,
				"dt": date.toLocaleString(window.navigator.language, { weekday: 'short' }),
				"dm": date.getDate(),
				"mn": date.getMonth() + 1,
				"mt": date.toLocaleString(window.navigator.language, { month: 'short' }),
				"dmt": date.toLocaleString(window.navigator.language, { day: "2-digit", month: "short" }),
				"today": DateTimeUtil.isToday(date) // FIXME Not working well on sundays
			});
		}
		return week;
	}

	// See: https://stackoverflow.com/a/6117889s
	static getWeekNumber(d: Date) :[number, number] {

		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		let yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
		return [d.getUTCFullYear(), weekNo];
	}

	static diff(d1: Date, d2: Date) :number{

		return d1.getTime() - d2.getTime();
	}
	
	static addDays(d: Date, days :number) :Date {
		
		var r = new Date(d);
		r.setDate(r.getDate() + days);
		return r;
	}

	static isToday(d: Date) :boolean {

		return new Date().toLocaleDateString() == d.toLocaleDateString();
	}

	static isYesterday(d: Date) :boolean {

		let y = new Date();
		y.setDate(new Date().getDate() - 1);
		return y.toLocaleDateString() == d.toLocaleDateString();
	}

	static isThisWeek(d: Date) :boolean {

		let tw = DateTimeUtil.getWeekNumber(new Date());
		let dw = DateTimeUtil.getWeekNumber(d);
		return tw[0] == dw[0] && tw[1] == dw[1];
	}

	static isLastWeek(d: Date) :boolean {

		let tw = DateTimeUtil.getWeekNumber(new Date());
		let dw = DateTimeUtil.getWeekNumber(d);
		return (tw[0] == dw[0] && tw[1] == dw[1] + 1) || (tw[0] == dw[0] + 1 && tw[1] == 1);
	}

	static isThisMonth(d: Date) :boolean {

		let tm1 = new Date(); tm1.setDate(1); tm1.setHours(0); tm1.setMinutes(0); tm1.setSeconds(0);
		let dm1 = new Date(d.getFullYear(), d.getMonth(), 1);

		return tm1.toLocaleDateString() == dm1.toLocaleDateString();
	}

	static isLastMonth(d: Date) :boolean {

		let lm1;
		let t = new Date();
		if (d.getMonth() > 0)
			lm1 = new Date(t.getFullYear(), t.getMonth() - 1, 1);
		else
			lm1 = new Date(t.getFullYear() - 1, 11, 1);
		lm1.setHours(0); lm1.setMinutes(0); lm1.setSeconds(0);
		let dm1 = new Date(d.getFullYear(), d.getMonth(), 1);
		return lm1.toLocaleDateString() == dm1.toLocaleDateString();
	}
}

// TODO Consider reimplementing this as a service
// TODO Db servicing of History, Note (and others such as ProjectTask) is pretty much the same: provide as interface
// TODO A History purge utility would be very likely a good idea (removal of history attached (not related, beware) to deleted objects))
export class History {

	_id: string;
	_rev: string;
	type: string;
	summary: string;
	attachedTo: string;
	relatedTo: string|null;
	usr: string;
	timestamp: Date;
	dateFilterLabels: Array<string> = [];

	constructor(d: any) {

		this._id = d._id;
		this._rev = d._rev;
		this.type = 'HistEntry';
		this.summary = d.summary;
		this.attachedTo = d.attachedTo;
		this.relatedTo = d.relatedTo!=''?d.relatedTo:null;
		this.usr = d.usr;
		this.timestamp = new Date(Date.parse(d.timestamp));
	}

	stringify() {

		let o = {
			"_id": this._id,
			"_rev_": this._rev,
			"type": 'HistEntry',
			"summary": this.summary,
			"attachedTo": this.attachedTo,
			"relatedTo": this.relatedTo!=null?this.relatedTo:'',
			"usr": this.usr,
			"timestamp": this.timestamp.toISOString()
		};
		return JSON.stringify(o);
	}

	static getFor(objectId: string, http: HttpClient): Promise<Array<History>> {

		return new Promise((resolve, reject) => {
			let objDataUrl = `/_data/_design/global-scope/_view/history-for?key="${objectId}"&include_docs=true`;
			http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data: any) => {
				if(!data.error) {
					let r: Array<History> = [];
					_.forEach(data.rows, (row: any) => {
						r.push(new History(row.doc));
					})
					resolve(_.reverse(_.sortBy(r, ['timestamp'])));
				}
				else
					reject(`\uD83D\uDCA3 !!! ${data.reason} !!! \uD83D\uDCA3`);
			});
		});
	}
 
	// TODO Not sure whether aggregation is working fine... test thoroughfully
	static make(summary :string, attachedTo :string, relatedTo :string|null, aggregate :number|null, http :HttpClient) :Promise<void> {

		return new Promise<void>((resolve, reject) => {
			if (aggregate == null) {
				http.get('/_uuid', { "observe": "body", "responseType": "json" }).subscribe((data :any) => {
					let e = new History({
						"_id": data.uuid,
						"type": "HistEntry",
						"summary": summary,
						"attachedTo": attachedTo,
						"relatedTo": relatedTo,
						"usr": UserService.getLoggedUser().id,
						"timestamp": new Date()
					});
					let dbObjUrl = `/_data/${e._id}`;
					http.put(dbObjUrl, e.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json"})}).subscribe((putResp :any) => {
						if(!putResp.ok)
							reject(`\uD83D\uDCA3 !!! ${putResp.reason} !!! \uD83D\uDCA3`);
						else
							resolve();
					});
				});
			}
			else {
				History.getFor(attachedTo, http).then((h :any) => {
					h = _.filter(h, (o) => {
						return o.usr==UserService.getLoggedUser().id && o.relatedTo==relatedTo;
					});					
					let now = new Date();
					h = _.filter(h, (o) => {
						return DateTimeUtil.diff(now, o.timestamp) <= aggregate;
					});
					if (h.length == 0) {//Can't aggregate, new entry
						History.make(summary, attachedTo, relatedTo, null, http).then(() => {
							resolve();
						}, (reason) => {
							reject(`\uD83D\uDCA3 !!! ${reason} !!! \uD83D\uDCA3`);
						});
					}
					else {
						h = _.sortBy(h, ['timestamp']);
						// TODO Improve summary on aggregation (figure out how)
						History.make(`${h[0].summary}`, attachedTo, relatedTo, null, http).then(() => {
							resolve();
						}, (reason) => {
							reject(`\uD83D\uDCA3 !!! ${reason} !!! \uD83D\uDCA3`);
						});;
						_.forEach(h, (o) => {
							let dbObjUrl = `/_data/${o._id}?rev=${o._rev}`;
							http.delete(`${dbObjUrl}`, {}).subscribe(() => { /* Nothing to do here */ });
						});
					}
				});
			}			
		});
	}
}

// TODO Consider reimplementing this as a service
// TODO Db servicing of History, Note (and others such as ProjectTask) is pretty much the same: provide as interface
export class Note {

	_id :string;
	_rev :string;
	type :string;
	summary :string;
	descr :string;
	usr :string;
	date :Date;
	attachedTo :string;
	
	modified: boolean;
	
	constructor(d :any) {
	
		this._id = d._id;
		this._rev = d._rev; 
		this.type = d.type;
		this.summary = d.summary; 
		this.descr = d.descr;
		this.usr = d.usr;
		this.date = new Date(Date.parse(d.date));
		this.attachedTo = d.attachedTo;
		this.modified = false;
	}

	stringify() {

		let o = {
			"_id": this._id,
			"_rev": this._rev,
			"type": this.type,
			"summary": this.summary,
			"descr": this.descr,
			"usr": this.usr,
			"date": this.date.toISOString(),
			"attachedTo": this.attachedTo
		};
		return JSON.stringify(o);
	}
		
	refresh(rev :string) {
		
		this.modified = false;
		this._rev = rev;
	}

	delete(http :HttpClient) :Promise<void> {
		
		return new Promise((resolve, reject) => {
			let dbObjUrl = `/_data/${this._id}`;
			http.delete(`${dbObjUrl}?rev=${this._rev}`).subscribe((delResp :any) => {
				if(delResp.ok)
					resolve();
				else
					reject(`\uD83D\uDCA3 !!! ${delResp.reason} !!! \uD83D\uDCA3`);
			});
		});
	}

	update(http :HttpClient) :Promise<void>  {

		return new Promise((resolve, reject) => {
			let dbObjUrl = `/_data/${this._id}`; 
			http.put(dbObjUrl, this.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json"})}).subscribe((putResp :any) => {
				if(putResp.ok) {
					this.refresh(putResp.rev);
					resolve();
				}
				else
					reject(`\uD83D\uDCA3 !!! ${putResp.reason} !!! \uD83D\uDCA3`);
			});
		});
	}
	
	static getFor(objectId :string, http :HttpClient) :Promise<Array<Note>> {

		return new Promise((resolve, reject) => {
			// TODO Optimize view: maybe not all fields are required to be emitted as we're using &include_docs=true
			let objDataUrl = `/_data/_design/global-scope/_view/notes-attached-to?key="${objectId}"&include_docs=true`;
			http.get(objDataUrl, {"observe": "body", "responseType": "json"}).subscribe((data :any) => {
				if(!data.error) {
					let r :Array<Note> = [];
					_.forEach(data.rows, (row) =>{
						r.push(new Note(row.doc));
					});
					resolve(_.reverse(_.sortBy(r, ['date'])));
				}
				else
					reject(`\uD83D\uDCA3 !!! ${data.reason} !!! \uD83D\uDCA3`); 
			});
		});
	}

	static create(attachedTo :string, http :HttpClient) :Promise<Note> {
	
		return new Promise((resolve, reject) => {
			http.get('/_uuid').subscribe((data :any) => {
				let n :Note = new Note({
					"_id": data.uuid,
					"type": "Note",
					"summary": "New note",
					"descr": "",
					"usr": UserService.getLoggedUser().id,
					"date": new Date().toISOString(),
					"attachedTo": attachedTo
				});
				let dbObjUrl = `/_data/${n._id}`;	
				http.put(dbObjUrl, n.stringify(), { "headers": new HttpHeaders({ "Content-Type": "application/json"})}).subscribe((putResp :any) => {
					if(putResp.ok) {
						n.refresh(putResp.rev);
						resolve(n);
					}
					else
						reject(`\uD83D\uDCA3 !!! ${putResp.reason} !!! \uD83D\uDCA3`);
				});
			});
		});
	}
}

export class UI {

	static getScrollbarWidth(): number {

		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll'; 
		document.body.appendChild(outer);
		const inner = document.createElement('div');
		outer.appendChild(inner);
		const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
		outer!.parentNode!.removeChild(outer);
		return scrollbarWidth;
	}
	
	static textAreaFitContents(t :HTMLTextAreaElement) :void {
		
		t.style.height = '1px'; 
		t.style.height = (25 + t.scrollHeight) + 'px';
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
