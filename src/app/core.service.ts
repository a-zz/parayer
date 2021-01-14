// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: Core service
// App global-scope service and utilities
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
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

export class DateTimeUtil {
	
	static computeWeek(selectedDate :Date) {

		let week = [];
		for(let d = 1 - selectedDate.getDay(); d<=7-selectedDate.getDay(); d++) {
			let date = new Date(selectedDate);
			date.setDate(date.getDate() + d);		
			week.push({
				"dt": date.toLocaleString(window.navigator.language, {weekday: 'short'}), 
				"dm": date.getDate(), 
				"mn": date.getMonth()+1, 
				"mt":  date.toLocaleString(window.navigator.language, {month: 'short'}),
				"dmt":  date.toLocaleString(window.navigator.language, {day: "2-digit", month: "short"}),
				"today": (d==0)
			});
		}	
		return week;
	}
	
	// See: https://stackoverflow.com/a/6117889s
	static getWeekNumber(d :Date) {
	   	
		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
	    let yearStart :Date = new Date(Date.UTC(d.getUTCFullYear(),0,1));
	    var weekNo = Math.ceil(( ( (d.getMilliseconds() - yearStart.getMilliseconds()) / 86400000) + 1)/7);
	    return [d.getUTCFullYear(), weekNo];
	}
	
	static diff(d1 :Date, d2 :Date) {
		
		let u1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds(), d1.getMilliseconds());
		let u2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes(), d2.getSeconds(), d2.getMilliseconds());
		return u1-u2;
	}	
	
	static isToday(d :Date) {
		
		return new Date().toLocaleDateString()==d.toLocaleDateString();			
	}
	
	static isYesterday(d :Date) {
		
		let y = new Date(); 
		y.setDate(new Date().getDate()-1);
		return y.toLocaleDateString()==d.toLocaleDateString();
	}
	
	static isThisWeek(d :Date) {
		
		let tw = DateTimeUtil.getWeekNumber(new Date());
		let dw = DateTimeUtil.getWeekNumber(d);
		return tw[0]==dw[0] && tw[1]==dw[1];
	}	
	
	static isLastWeek(d :Date) {
		
		let tw = DateTimeUtil.getWeekNumber(new Date());
		let dw = DateTimeUtil.getWeekNumber(d);
		return (tw[0]==dw[0] && tw[1]==dw[1]+1) || (tw[0]==dw[0]+1 && tw[1]==1);   
	}
	
	static isThisMonth(d :Date) {
		
		let tm1 = new Date(); tm1.setDate(1); tm1.setHours(0); tm1.setMinutes(0); tm1.setSeconds(0);
		let dm1 = new Date(d.getFullYear(), d.getMonth(), 1);
		
		return tm1.toLocaleDateString()==dm1.toLocaleDateString();
	}
	
	static isLastMonth(d :Date) {
		
		let lm1;
		let t = new Date();
		if(d.getMonth()>0)
			lm1 = new Date(t.getFullYear(), t.getMonth()-1, 1);
		else
		 	lm1 = new Date(t.getFullYear()-1, 11, 1);
		lm1.setHours(0); lm1.setMinutes(0); lm1.setSeconds(0);
		let dm1 = new Date(d.getFullYear(), d.getMonth(), 1); 
		return lm1.toLocaleDateString()==dm1.toLocaleDateString();
	}
}

export class UI {
	
	static getScrollbarWidth() :number {

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
