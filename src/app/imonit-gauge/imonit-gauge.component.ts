// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ImonitGaugeComponent
// Gauge-lookalike Attendance & Effort summary 
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { AfterContentChecked, Component, ElementRef } 
	from '@angular/core';
	
import * as _
	from 'lodash';

@Component({
	selector: 'app-imonit-gauge',
	templateUrl: './imonit-gauge.component.html',
	styleUrls: ['./imonit-gauge.component.css']
})
export class ImonitGaugeComponent implements AfterContentChecked {
	
	attendanceRequired :Array<number>; 
	attendanceLogged :Array<number>;
	effortLogged :Array<number>; 
	
	gaugeStyle :any|null = null;
	
	attReqLine :any|null = null;
	attReqTxt : any|null = null;
	
	attLogCaption :any|null = null;
	attLogBar :any|null = null;
	attLogTxt :any|null = null;
	attLogDevBar :any|null = null;
	attLogDevTxt :any|null = null;
	attLogLine :any|null = null;
	
	effLogCaption :any|null = null;
	effLogBar :any|null = null;
	effLogTxt :any|null = null;
	effLogDevBar :any|null = null;
	effLogDevTxt :any|null = null;
		
	constructor(private _e :ElementRef) { 
		
		// TODO Test data
		this.attendanceRequired = [6, 36]; 
		this.attendanceLogged = [Math.floor(Math.random() * (10 - 5)) + 5, Math.floor(Math.random()*60)];
		this.effortLogged = [Math.floor(Math.random() * (10 - 5)) + 5, Math.floor(Math.random()*60)]; 
	}

	ngAfterContentChecked(): void {
		
		let margin = 10;
		let maxBarWidth = (this._e.nativeElement.offsetWidth - 2 * margin) * 0.65;
		let vGrid = (this._e.nativeElement.offsetHeight - 2 * margin)/9;
		let attReq = this.attendanceRequired[0]*60 + this.attendanceRequired[1];
		let attLog = this.attendanceLogged[0]*60 + this.attendanceLogged[1];
		let effLog = this.effortLogged[0]*60 + this.effortLogged[1];
		let scaleX = maxBarWidth / _.max([attReq, attLog, effLog])!;
		
		this.gaugeStyle = `font-size: ${vGrid}px;`;
		
		this.attReqLine = { 
			"x1": margin + attReq * scaleX, 
			"y1": margin + vGrid * 0.5, 
			"x2": margin + attReq * scaleX, 
			"y2": margin + vGrid * 4 
		};
		this.attReqTxt = { 
			"x": margin + attReq * scaleX, 
			"y": margin + vGrid * 0.5, 
			"txt": this.hmmFormat(this.attendanceRequired)
		}; 
		
		this.attLogCaption = { 
			"x": margin, 
			"y": margin + vGrid * 1.75  
		};
		this.attLogBar = { 
			"x": margin, 
			"y": margin + vGrid * 2, 
			"width": _.min([attLog, attReq])! * scaleX, 
			"height": vGrid * 2
		};
		this.attLogTxt = { 
			"x": margin * 1.5, 
			"y": margin + vGrid * 3.75, 
			"txt": this.hmmFormat(this.attendanceLogged)
		};
		this.attLogDevBar = { 
			"x": margin + _.min([attLog, attReq])! * scaleX, 
			"y": margin + vGrid * 2, 
			"width": Math.abs(attReq-attLog) * scaleX, 
			"height": vGrid * 2, 
			"class": attReq-attLog>0?"deviation-bar-accent":"deviation-bar-primary" 
		};
		this.attLogDevTxt = { 
			"x": margin * 1.5 + _.min([attLog, attReq])! * scaleX, 
			"y": margin + vGrid * 3.75, 
			"txt": this.hmmDevFormat(this.attendanceLogged, this.attendanceRequired),
			"class": attReq-attLog>0?"logged-bar-label-accent":"logged-bar-label-primary"
		};
		this.attLogLine = { 
			"x1": margin + attLog * scaleX, 
			"y1": margin + vGrid * 4, 
			"x2": margin + attLog * scaleX, 
			"y2": margin + vGrid * 8 
		};
		
		this.effLogCaption = { 
			"x": margin, 
			"y": margin + vGrid * 5.75
		};
		this.effLogBar = { 
			"x": margin, 
			"y": margin + vGrid * 6,
			"width": _.min([effLog, attLog])! * scaleX, 
			"height": vGrid * 2
		};
		this.effLogTxt = { 
			"x": margin * 1.5, 
			"y": margin + vGrid * 7.75, 
			"txt": this.hmmFormat(this.effortLogged) 
		};		
		this.effLogDevBar = { 
			"x": margin + _.min([effLog, attLog])! * scaleX, 
			"y": margin + vGrid * 6, 
			"width": Math.abs(effLog-attLog) * scaleX, 
			"height": vGrid * 2
		};
		this.effLogDevTxt = { 
			"x": margin * 1.5 + _.min([effLog, attLog])! * scaleX, 
			"y": margin + vGrid * 7.75, 
			"txt": this.hmmDevFormat(this.effortLogged, this.attendanceLogged) 
		};
	}
	
	hmmFormat(t :Array<number>) :string {
		
		return `${t[0]}:${t[1]<10?'0'+t[1]:t[1]}`;
	}
	
	hmmDevFormat(t :Array<number>, tref :Array<number>) :string {
		
		let dm = (t[0]*60 + t[1]) - (tref[0]*60 + tref[1]);
		// TODO Text-hiding threshold should be configurable
		if(Math.abs(dm)>=15)
			return `${dm<0?'-' + Math.abs(Math.ceil(dm/60)):'+' + Math.floor(dm/60)}:${Math.abs(dm%60)<10?'0'+Math.abs(dm%60):Math.abs(dm%60)}`;
		else
			return '';
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
