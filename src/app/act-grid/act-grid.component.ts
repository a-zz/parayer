// TODO Code cleanup, method contracts, etc.
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
	selector: 'app-act-grid',
	templateUrl: './act-grid.component.html',
	styleUrls: ['./act-grid.component.css']
})
export class ActGridComponent implements OnInit {

	constructor(private _nav: NavigationComponent) { }

	ngOnInit(): void {

		// TODO Test code
		this._nav.setLocation('My activity', 'table_chart');
		this._nav.showWait(false);
	}
}
