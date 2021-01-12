// TODO Code cleanup, method contracts, etc.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActGridComponent } from './act-grid/act-grid.component';
import { ActAreaComponent } from './act-area/act-area.component';
import { ActGroupComponent } from './act-group/act-group.component';
import { ProjectComponent } from './project/project.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyPreferencesComponent } from './my-preferences/my-preferences.component';


@NgModule({
	declarations: [
		AppComponent,
		ActGridComponent,
		ActAreaComponent,
		ActGroupComponent,
		ProjectComponent,
		NavigationComponent,
		MyAccountComponent,
		MyPreferencesComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		LayoutModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatSnackBarModule,
		HttpClientModule
	],
	providers: [
		NavigationComponent
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
