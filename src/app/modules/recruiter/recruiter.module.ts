import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { RecruiterComponent } from './recruiter.component';
import { SharedModule } from '../shared/shared.module';
import { RecruiterRoutingModule } from './recruiter-routing.module';
import { RecruiterSidebarComponent } from './sidebar/recruiter-sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecruiterService } from './services/recruiter.service';
import { RatingService } from '../shared/services/rate.service';
import { ShareService } from './services/share.service';
import { SavedStudentsService } from './services/saved-students.service';
import { SavedSearchService } from './services/saved-search.service';
import { SearchComponent } from './search/search.component';
import { SavedStudentsComponent } from './saved-students/saved-students.component';
import { Letters } from './letters/letters.component';
import { SavedSearchesComponent } from './saved-searches/saved-searches.component';
import { CreateSearchModalComponent } from './search/create-search-modal/create-search-modal.component';
import { DeleteSavedSearchModalComponent } from './saved-searches/delete-saved-search-modal/delete-saved-search-modal.component';
import { ViewCriteriaModalComponent } from './saved-searches/view-criteria-modal/view-criteria-modal.component';
import { ShareModalComponent } from './share/share-modal.component';
import { StudentProfileModalComponent } from './share/student-profile-modal.component';
import { SearchFilterComponent } from './search/search-filter.component';
import { SearchResultsComponent } from './search/search-results.component';
import { StudentDetails } from './student-details/student-details.component';
import { MomentModule } from 'ngx-moment';
import { StudentModule } from '../student/student.module';
import { StudentSearchLogService } from './services/student-search-log.service';
import { ResourcesComponent } from './resources/resources.component';
import { HelpComponent } from './resources/help/help.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';
import { DanceSearchComponent } from './search/dance-search/dance-search.component';
import { DanceFilterComponent } from './search/dance-filter/dance-filter.component';
import { DanceSearchResultComponent } from './search/dance-search-result/dance-search-result.component';
import { StudentInterestedInComponent } from './student-interested-in/student-interested-in.component';
import { StudentsInterestedInService } from './services/students-interested-in.service';

@NgModule({
	bootstrap: [
		RecruiterComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		RecruiterRoutingModule,
		NgbModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		StudentModule,
		MomentModule
	],
	declarations: [
		RecruiterComponent,
		DashboardComponent,
		SearchComponent,
		SearchFilterComponent,
		SearchResultsComponent,
		SavedStudentsComponent,
		Letters,
		SavedSearchesComponent,
		CreateSearchModalComponent,
		DeleteSavedSearchModalComponent,
		ViewCriteriaModalComponent,
		StudentDetails,
		ShareModalComponent,
		StudentProfileModalComponent,
		RecruiterSidebarComponent,
		ResourcesComponent,
		FaqsComponent,
		HelpComponent,
		PDFsComponent,
		VideosComponent,
		DanceSearchComponent,
		DanceFilterComponent,
		DanceSearchResultComponent,
		StudentInterestedInComponent,
	],
	providers: [
		RecruiterService,
		SavedSearchService,
		SavedStudentsService,
		StudentSearchLogService,
		ShareService,
		StudentsInterestedInService,
		RatingService,
		NgbActiveModal,
		DecimalPipe
	],
	entryComponents: [
		CreateSearchModalComponent,
		DeleteSavedSearchModalComponent,
		ViewCriteriaModalComponent,
		ShareModalComponent,
		StudentProfileModalComponent,
	],
	exports: [
	]
})

export class RecruiterModule { }
