import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { MomentModule } from 'ngx-moment';

import { ParentComponent } from './parent.component';
import { SharedModule } from '../shared/shared.module';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentService } from './services/parent.service';
import { ParentStudentDetails } from './parent-student-details/parent-student-details.component';
import { StudentPSectionComponent } from './student-section/student-section.component';
import { AddStudentPModalComponent } from './student-section/add-student-modal/add-student-modal.component';
import { UpdateStudentPModalComponent } from './student-section/update-student-modal/update-student-modal.component';
import { DeleteStudentPModalComponent } from './student-section/delete-student-modal/delete-student-modal.component';
import { PremiumModalComponent } from './student-section/premium-modal/premium-modal.component';
import { BulkUpgradeModalComponent } from './student-section/bulk-upgrade-modal/bulk-upgrade-modal.component';
import { ParentSidebarComponent } from './sidebar/parent-sidebar.component';
import { StudentModule } from '../student/student.module';
import { ParentBillingComponent } from './billing/billing.component';
import { AccountComponent } from './account/account.component';
import { UpgradeStudentModalComponent } from './student-section/upgrade-student-modal/upgrade-student-modal.component';
import { ResourcesComponent } from './resources/resources.component';
import { HelpComponent } from './resources/help/help.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';

@NgModule({
	bootstrap: [
		ParentComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		ParentRoutingModule,
		NgbModule.forRoot(),
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		StudentModule,
		MomentModule
	],
	declarations: [
		ParentComponent,
		ParentStudentDetails,
		StudentPSectionComponent,
		AddStudentPModalComponent,
		UpdateStudentPModalComponent,
		DeleteStudentPModalComponent,
		ParentBillingComponent,
		PremiumModalComponent,
		BulkUpgradeModalComponent,
		ParentSidebarComponent,
		AccountComponent,
		UpgradeStudentModalComponent,
		ResourcesComponent,
		FaqsComponent,
		HelpComponent,
		PDFsComponent,
		VideosComponent
	],
	providers: [
		ParentService, 
		NgbActiveModal
	],
	entryComponents: [
		AddStudentPModalComponent,
		UpdateStudentPModalComponent,
		DeleteStudentPModalComponent,
		PremiumModalComponent,
		BulkUpgradeModalComponent,
		UpgradeStudentModalComponent
	],
	exports: [

	]
})
export class ParentModule { }

// export { };
