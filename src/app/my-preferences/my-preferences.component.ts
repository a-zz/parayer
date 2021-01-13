// TODO Code cleanup, method contracts, etc.
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
	selector: 'app-my-preferences',
	templateUrl: './my-preferences.component.html',
	styleUrls: ['./my-preferences.component.css']
})
export class MyPreferencesComponent implements OnInit {

	constructor(private _nav: NavigationComponent) { }

	ngOnInit(): void {

		// TODO Test code
		this._nav.setLocation('My account', 'build');
		this._nav.showWait(false);
	}
}
