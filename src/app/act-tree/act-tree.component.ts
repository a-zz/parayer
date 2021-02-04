// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ActTreeComponent
// User activity management
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component, OnInit } 
	from '@angular/core';
	
import { NavigationComponent } 
	from '../navigation/navigation.component';

@Component({
	selector: 'app-act-tree',
	templateUrl: './act-tree.component.html',
	styleUrls: ['./act-tree.component.css']
})
export class ActTreeComponent implements OnInit {

	constructor(private _nav :NavigationComponent) {

		this._nav.showWait(true);
		this._nav.setLocation('My activity', 'account_tree');
		this._nav.showWait(false);
	}

	ngOnInit(): void {
	}

}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
