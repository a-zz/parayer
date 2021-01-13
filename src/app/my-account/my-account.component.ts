// TODO Code cleanup, method contracts, etc.
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

	constructor(private _nav: NavigationComponent) { }

	ngOnInit(): void {

		// TODO Test code
		this._nav.setLocation('My account', 'person');
		this._nav.showWait(false);
	}
}
