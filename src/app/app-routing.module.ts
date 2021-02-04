// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: AppRoutingModule
// App rotuing management module
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// TODO Consider route transition animations (as per https://angular.io/guide/route-animations), or even single-page operation 
import { NgModule }
	from '@angular/core';
import { RouterModule }
	from '@angular/router';
import { Routes }
	from '@angular/router';

import { ActAreaComponent }
	from './act-area/act-area.component';
import { ActGroupComponent }
	from './act-group/act-group.component';
import { ActTreeComponent }
	from './act-tree/act-tree.component';
import { MyAccountComponent }
	from './my-account/my-account.component';
import { MyPreferencesComponent }
	from './my-preferences/my-preferences.component';
import { PlanAndTrackComponent }
	from './plan-and-track/plan-and-track.component';
import { ProjectComponent }
	from './project/project.component';

const routes: Routes = [
	{ path: 'act-area/:id', 	component: ActAreaComponent },	
	{ path: 'act-group/:id',	component: ActGroupComponent },
	{ path: 'act-tree',			component: ActTreeComponent },
	{ path: 'my-account', 		component: MyAccountComponent },
	{ path: 'my-preferences',	component: MyPreferencesComponent },
	{ path: 'plan-and-track', 	component: PlanAndTrackComponent },	
	{ path: 'project/:id',		component: ProjectComponent },
	{ path: '',  				redirectTo: '/plan-and-track', pathMatch: 'full' },
	{ path: '**', 				component: PlanAndTrackComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
// -------------------------------------------------------------------------------------------------------------------------------------------------------------