// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: MyPreferencesComponent
// App preferences management
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component } 			from '@angular/core';
import { OnInit } 				from '@angular/core';

import { NavigationComponent }	from '../navigation/navigation.component';

@Component({
	selector: 'app-my-preferences',
	templateUrl: './my-preferences.component.html',
	styleUrls: ['./my-preferences.component.css']
})
export class MyPreferencesComponent implements OnInit {

	constructor(private _nav: NavigationComponent) { 
		
		this._nav.setLocation('My preferences', 'build');
	}

	ngOnInit(): void {

		// TODO Test code
		this._nav.showWait(false);
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
