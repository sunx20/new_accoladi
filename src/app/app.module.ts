/* **************************************************************************************
	MODULES  (put in '@NgModule - imports:')
************************************************************************************** */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FlashMessagesModule } from 'angular2-flash-messages';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentModule } from './modules/student/student.module';
import { RecruiterModule } from './modules/recruiter/recruiter.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ParentModule } from './modules/parent/parent.module';

import { AppRoutingModule } from './app.routing.module';

/* **************************************************************************************
	SERVICES (put in '@NgModule - providers:')
************************************************************************************** */


/* **************************************************************************************
	COMPONENTS (put in '@NgModule - declarations:')
************************************************************************************** */
import { AppComponent } from './app.component';

/* **************************************************************************************
	NgModule
		- imports(modules)
		- declarations(components)
		- providers(services)
		- bootstrap(component to start with)
************************************************************************************** */
@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		FlashMessagesModule.forRoot(),
		ReactiveFormsModule,
		NgSelectModule,
		MomentModule,
		NgbModule.forRoot(),
		SharedModule,
		AuthModule,
		StudentModule,
		RecruiterModule,
		TeacherModule,
		ParentModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent
	],
	providers: [

	],
	bootstrap: [
		AppComponent
	],
	entryComponents: [
	]
})

export class AppModule { }