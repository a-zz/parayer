// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: Core service
// App global-scope service and utilities
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient } 				from '@angular/common/http';
import { Injectable } 				from '@angular/core';

import * as _ 						from 'lodash';

import { UserService }				from './core.services'
import { NavigationComponent }		from './navigation/navigation.component';

export class DateTimeUtil {

	static computeWeek(selectedDate: Date) {

		let week = [];
		for (let d = 1 - selectedDate.getDay(); d <= 7 - selectedDate.getDay(); d++) {
			let date = new Date(selectedDate);
			date.setDate(date.getDate() + d);
			week.push({
				"dt": date.toLocaleString(window.navigator.language, { weekday: 'short' }),
				"dm": date.getDate(),
				"mn": date.getMonth() + 1,
				"mt": date.toLocaleString(window.navigator.language, { month: 'short' }),
				"dmt": date.toLocaleString(window.navigator.language, { day: "2-digit", month: "short" }),
				"today": (d == 0)
			});
		}
		return week;
	}

	// See: https://stackoverflow.com/a/6117889s
	static getWeekNumber(d: Date) {

		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		let yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
		return [d.getUTCFullYear(), weekNo];
	}

	static diff(d1: Date, d2: Date) {

		let u1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds(), d1.getMilliseconds());
		let u2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes(), d2.getSeconds(), d2.getMilliseconds());
		return u1 - u2;
	}

	static isToday(d: Date) {

		return new Date().toLocaleDateString() == d.toLocaleDateString();
	}

	static isYesterday(d: Date) {

		let y = new Date();
		y.setDate(new Date().getDate() - 1);
		return y.toLocaleDateString() == d.toLocaleDateString();
	}

	static isThisWeek(d: Date) {

		let tw = DateTimeUtil.getWeekNumber(new Date());
		let dw = DateTimeUtil.getWeekNumber(d);
		return tw[0] == dw[0] && tw[1] == dw[1];
	}

	static isLastWeek(d: Date) {

		let tw = DateTimeUtil.getWeekNumber(new Date());
		let dw = DateTimeUtil.getWeekNumber(d);
		return (tw[0] == dw[0] && tw[1] == dw[1] + 1) || (tw[0] == dw[0] + 1 && tw[1] == 1);
	}

	static isThisMonth(d: Date) {

		let tm1 = new Date(); tm1.setDate(1); tm1.setHours(0); tm1.setMinutes(0); tm1.setSeconds(0);
		let dm1 = new Date(d.getFullYear(), d.getMonth(), 1);

		return tm1.toLocaleDateString() == dm1.toLocaleDateString();
	}

	static isLastMonth(d: Date) {

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

export class History {

	_id: string;
	_rev: string;
	type: string;
	summary: string;
	attachedTo: string;
	relatedTo: string;
	usr: string;
	timestamp: Date;
	dateFilterLabels: Array<string> = [];

	constructor(d: any) {

		this._id = d._id;
		this._rev = d._rev;
		this.type = 'HistEntry';
		this.summary = d.summary;
		this.attachedTo = d.attachedTo;
		this.relatedTo = d.relatedTo;
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
			"relatedTo": this.relatedTo,
			"usr": this.usr,
			"timestamp": this.timestamp.toISOString()
		};
		return JSON.stringify(o);
	}

	static getFor(objectId: string, http: HttpClient): Promise<Array<History>> {

		let p: Promise<Array<History>> = new Promise(function(resolve, reject) {
			let objDataUrl = `/_data/_design/global-scope/_view/history-for?key="${objectId}"&include_docs=true`;
			http.get(objDataUrl, { "observe": "body", "responseType": "json" }).subscribe((data: any) => {
				let r: Array<History> = [];
				_.forEach(data.rows, function(row: any) {
					r.push(new History(row.doc));
				})
				resolve(_.reverse(_.sortBy(r, ['timestamp'])));
			});
		});
		return p;
	}

	static make(summary :string, attachedTo :string, relatedTo :string, aggregate :number|null, http :HttpClient, nav :NavigationComponent) {

		if (aggregate == null) {
			http.get('/_uuid', { "observe": "body", "responseType": "json" }).subscribe((data :any) => {
				let e = new History({
					"_id": data.uuid,
					"type": "HistEntry",
					"summary": summary,
					"attachedTo": attachedTo,
					"relatedTo": Array.isArray(relatedTo) ? relatedTo : [],
					"usr": UserService.getLoggedUser().id,
					"timestamp": new Date()
				});
				let dbObjUrl = `/_data/${e._id}`;
				http.put(dbObjUrl, e.stringify()).subscribe((putResp :any) => {
					if (putResp.status == 200) {
						if (!putResp.data.ok)
							nav.showSnackBar(`History saving failed! ${putResp.data.reason}`);
					}
					else
						nav.showSnackBar('History saving failed! Contact your system admin');
				});
			});
		}
		else {
			History.getFor(attachedTo, http).then((h) => {
				h = _.filter(h, { "usr": UserService.getLoggedUser().id, "relatedTo": relatedTo });
				let now = new Date();
				h = _.filter(h, function(o) {
					return DateTimeUtil.diff(now, o.timestamp) <= aggregate;
				});
				if (h.length == 0) //Can't aggregate, new entry
					History.make(summary, attachedTo, relatedTo, null, http, nav);
				else {
					h = _.sortBy(h, ['timestamp']);
					// TODO Improve summary on aggregation (figure out how)
					History.make(`${h[0].summary}`, attachedTo, relatedTo, null, http, nav);
					for (let i = 0; i < h.length; i++) {
						let dbObjUrl = `/_data/${h[i]._id}`;
						http.delete(`${dbObjUrl}?rev=${h[i]._rev}`);
					}
				}
			});
		}
	}
}

// TODO Not actually working as singleton service, not injected at app startup
@Injectable({ providedIn: 'root' })
export class RefChips {
	
	rccache :Array<{ "expiry": number, "data": any }>;
	
	constructor() {
		
		this.rccache = [];
		console.log('Should be shown just once!')
	}
	
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

export class UI {

	static getScrollbarWidth(): number {

		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll';
		//outer.style.msOverflowStyle = 'scrollbar'; 
		document.body.appendChild(outer);
		const inner = document.createElement('div');
		outer.appendChild(inner);
		const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
		outer!.parentNode!.removeChild(outer);
		return scrollbarWidth;
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
