// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: AppModule
// App root module
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// TODO Put some order here...
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }
	from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';

import { ActAreaComponent } from './act-area/act-area.component';
import { ActGroupComponent } from './act-group/act-group.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImonitGaugeComponent } from './imonit-gauge/imonit-gauge.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyPreferencesComponent } from './my-preferences/my-preferences.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PlanAndTrackComponent } from './plan-and-track/plan-and-track.component';
import { ProjectComponent } from './project/project.component';
import { RefChipsComponent } from './ref-chips/ref-chips.component';
import { SimpleConfirmDialogComponent } from './navigation/simple-confirm-dialog.component';
import { ActTreeComponent } from './act-tree/act-tree.component';

@NgModule({
	declarations: [
		ActAreaComponent,
		ActGroupComponent,
		ActTreeComponent,
		AppComponent,
		ImonitGaugeComponent,
		MyAccountComponent,
		MyPreferencesComponent,
		NavigationComponent,
		PlanAndTrackComponent,
		ProjectComponent,
		RefChipsComponent,
		SimpleConfirmDialogComponent
	],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule, 
		HttpClientModule,		
		LayoutModule,
		MatButtonModule,
		MatCardModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatSelectModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTreeModule,
		ReactiveFormsModule
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
