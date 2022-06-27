import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { MomentModule } from 'ngx-moment';

import { TeacherComponent } from './teacher.component';
import { SharedModule } from '../shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherSidebarComponent } from './sidebar/teacher-sidebar.component';
import { StudentSectionComponent } from './student-section/student-section.component';
import { AddStudentTModalComponent } from './student-section/add-student-modal/add-student-modal.component';
import { DeleteStudentTModalComponent } from './student-section/delete-student-modal/delete-student-modal.component';
import { TeacherLetterComponent } from './teacher-letter/teacher-letter.component';
import { SendTeacherLetterModalComponent } from './teacher-letter/send-teacher-letter-modal/send-teacher-letter-modal.component';
import { TeacherLetterService } from './services/letter.service';
import { TeacherService } from './services/teacher.service';
import { ResourcesComponent } from './resources/resources.component';
import { HelpComponent } from './resources/help/help.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';

@NgModule({
	bootstrap: [
		TeacherComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		TeacherRoutingModule,
		NgbModule.forRoot(),
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		MomentModule
	],
	declarations: [
		TeacherComponent,
		TeacherSidebarComponent,
		StudentSectionComponent,
		AddStudentTModalComponent,
		DeleteStudentTModalComponent,
		TeacherLetterComponent,
		SendTeacherLetterModalComponent,
		ResourcesComponent,
		FaqsComponent,
		HelpComponent,
		PDFsComponent,
		VideosComponent
	],
	providers: [
		TeacherService,
		TeacherLetterService,
		NgbActiveModal
	],
	entryComponents: [
		AddStudentTModalComponent,
		DeleteStudentTModalComponent,
		SendTeacherLetterModalComponent
	],
	exports: [
	]
})

export class TeacherModule { }