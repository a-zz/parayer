// TODO Code cleanup, method contracts, etc.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActGridComponent } from './act-grid/act-grid.component';
import { ActAreaComponent } from './act-area/act-area.component';
import { ActGroupComponent } from './act-group/act-group.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
	{ path: 'act-grid', component: ActGridComponent },
	{ path: 'act-area', component: ActAreaComponent },
	{ path: 'act-group', component: ActGroupComponent },
	{ path: 'project', component: ProjectComponent },
	{ path: '',   redirectTo: '/act-grid', pathMatch: 'full' },
	{ path: '**', component: ActGridComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
