// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: PlanAndTrackComponent
// Calendar & effort grid (and main) component
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient }
	from '@angular/common/http';
import { Component, ViewChild } 	
	from '@angular/core';
import { MatTable } 
	from '@angular/material/table';	
import { Router } 
	from '@angular/router';	

import * as _
	from 'lodash';

import { DateTimeUtil, UI } 
	from '../core.utils';
import { NavigationComponent }	
	from '../navigation/navigation.component';

@Component({
	selector: 'app-plan-and-track',
	templateUrl: './plan-and-track.component.html',
	styleUrls: ['./plan-and-track.component.css']
})
//export class ActGridComponent implements AfterContentChecked, AfterViewChecked, OnDestroy, OnInit {
export class PlanAndTrackComponent  {

	@ViewChild(MatTable) table :MatTable<any> | undefined;
	displayedColumns: string[] = ['left', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'right']; 
	currentWeek :Array<any>;
	tslots: Array<GridLine> = [
	  	{ "name": "00:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "01:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "02:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "03:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "04:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "05:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "06:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "07:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "08:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "09:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "10:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "11:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "12:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "13:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "14:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "15:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "16:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "17:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "18:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "19:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "20:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "21:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "22:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
		{ "name": "23:00", "d1": "", "d2": "", "d3": "", "d4": "", "d5": "", "d6": "", "d7": "" },
	];
	
	constructor(
		private _http :HttpClient, 
		private _nav :NavigationComponent,
		private _router :Router) { 
		
		this._nav.showWait(true);
		this.currentWeek = DateTimeUtil.computeWeek(new Date());
		this._nav.setLocation('Plan & Track', 'book_online');
		this._nav.showWait(false);
	}
	
	// Required to force table header to be refreshed on week change 
	trackByIndex(i :number) {
		
		return i;
	}
	
	prevWeek() :void {
		
		this.goToDate(DateTimeUtil.addDays(this.currentWeek[3].d as Date, -7));
	}
	
	nextWeek() :void {
		
		this.goToDate(DateTimeUtil.addDays(this.currentWeek[3].d as Date, 7));
	}
	
	selectWeek(forDate :Date) {
    			
		this.goToDate(forDate);
  	}
	
	
	goToDate(target :Date) :void {
		
		this.currentWeek = DateTimeUtil.computeWeek(target);
		// TODO Fill in end date in week selector
		// TODO Reload this.tslots		
		this.table!.renderRows();
	}
}
 
export interface GridLine {
	
	"name" :string;
	"d1" :string;
	"d2" :string;
	"d3" :string;
	"d4" :string;
	"d5" :string;
	"d6" :string;
	"d7" :string;
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
