// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: RefChipsComponent
// Reference chips management 
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Component, Input, OnInit } 
	from '@angular/core';

import { RefChipsService } 
	from './ref-chips-service';

@Component({
	selector: 'app-ref-chip',
	templateUrl: './ref-chips.component.html',
	styleUrls: ['./ref-chips.component.css']
})
export class RefChipsComponent implements OnInit {

	@Input() targetId! :string;
	content :string = '...'; // TODO Maybe should be :InnerHTML
	
	constructor(private _dsrv :RefChipsService) { }

	ngOnInit() {
		
		this._dsrv.getFor(this.targetId).then((data) => {
			switch(data.type) {
			case "Usr":
				this.content = data.email;
				break;
			case "Note":
			case "ProjectTask":
				this.content = data.summary;
				break;
			case "Error":
				this.content = data.reason;
				break;
			default:
				this.content = '???';
			}
		});
	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
