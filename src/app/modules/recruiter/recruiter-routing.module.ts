import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { RecruiterComponent } from './recruiter.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { SavedSearchesComponent } from './saved-searches/saved-searches.component';
import { StudentDetails } from './student-details/student-details.component';
import { SavedStudentsComponent } from './saved-students/saved-students.component';
import { ResourcesComponent } from './resources/resources.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { HelpComponent } from './resources/help/help.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';

import {
	AccountComponent,
	CollegeSearchComponent,
	ScholarshipSearchComponent,
	PremierProgramSearchComponent,
	MessagesComponent,
	SettingsComponent
} from '../shared/shared.module';
import { JudgeNSDComponent } from '../shared/components/judge-nsd/judge-nsd.component';
import { MusicHistoryGuidsComponent } from '../shared/components/music-history-guids/music-history-guids.component';
import { MusicalTermsComponent } from '../shared/components/musical-terms/musical-terms.component';
import { AddMusicalTermComponent } from '../shared/components/musical-terms/add-musical-term/add-musical-term.component';
import { DanceSearchComponent } from './search/dance-search/dance-search.component';
import { StudentInterestedInComponent } from './student-interested-in/student-interested-in.component';

const routes: Routes = [
	{
		path: 'recruiter',
		component: RecruiterComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				redirectTo: 'settings',
				pathMatch: 'full'
			},
			{
				path: 'account',
				component: AccountComponent
			},
			{
				path: 'dashboard',
				component: DashboardComponent
			},
			{
				path: 'dashboard/:sid',
				component: StudentDetails
			},
			{
				path: 'messages',
				component: MessagesComponent
			},
			{
				path: 'students',
				redirectTo: 'students/saved',
				pathMatch: 'full'
			},
			{
				path: 'students/saved',
				component: SavedStudentsComponent // DashboardComponent
			},
			{
				path: 'students/interested-in',
				component: StudentInterestedInComponent
			},
			{
				path: 'students/letters',
				component: DashboardComponent
			},
			{
				path: 'resources',
				component: ResourcesComponent
			},
			{
				path: 'resources/faqs',
				component: FaqsComponent
			},
			{
				path: 'resources/help',
				component: HelpComponent
			},
			{
				path: 'resources/pdfs',
				component: PDFsComponent
			},
			{
				path: 'resources/videos',
				component: VideosComponent
			},
			{
				path: "resources/music-history",
				component: MusicHistoryGuidsComponent
			},
			{
				path: "resources/musical-terms",
				component: MusicalTermsComponent
			},
			{
				path: "resources/musical-terms/new",
				component: AddMusicalTermComponent
			},
			{
				path: 'search',
				redirectTo: 'search/talent',
				pathMatch: 'full'
			},
			{
				path: 'search/saved',
				component: SavedSearchesComponent
			},
			{
				path: 'search/colleges',
				component: CollegeSearchComponent
			},
			{
				path: 'search/scholarships',
				component: ScholarshipSearchComponent
			},
			{
				path: 'search/premier',
				component: PremierProgramSearchComponent
			},
			{
				path: 'search/talent',
				component: SearchComponent
			},
			{
				path: 'search/dance',
				component: DanceSearchComponent
			},
			{
				path: 'search/talent/:sid',
				component: StudentDetails
			},
			{
				path: 'share/student/:sid',
				component: StudentDetails
			},
			{
				path: 'settings',
				component: SettingsComponent
			},
			{
				path: 'judgensd',
				component: JudgeNSDComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})

export class RecruiterRoutingModule { }
