// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: AppModule
// App root module
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ActAreaComponent } from './act-area/act-area.component';
import { ActGridComponent } from './act-grid/act-grid.component';
import { ActGroupComponent } from './act-group/act-group.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyPreferencesComponent } from './my-preferences/my-preferences.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProjectComponent } from './project/project.component';

@NgModule({
	declarations: [
		ActAreaComponent,
		AppComponent,
		ActGridComponent,		
		ActGroupComponent,
		MyAccountComponent,
		MyPreferencesComponent,
		NavigationComponent,
		ProjectComponent
	],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,		
		LayoutModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatToolbarModule
	],
	providers: [
		NavigationComponent
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
