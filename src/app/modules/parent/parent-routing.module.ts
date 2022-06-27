import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ParentComponent } from './parent.component';
import { StudentPSectionComponent } from './student-section/student-section.component';
import { ParentStudentDetails } from './parent-student-details/parent-student-details.component';
import { AccountComponent} from './account/account.component'

import { ResourcesComponent } from './resources/resources.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { HelpComponent } from './resources/help/help.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';

import {
	CollegeSearchComponent,
	ScholarshipSearchComponent,
	PremierProgramSearchComponent,
	MessagesComponent,
	SettingsComponent
} from '../shared/shared.module';
import { MusicHistoryGuidsComponent } from '../shared/components/music-history-guids/music-history-guids.component';
import { MusicalTermsComponent } from '../shared/components/musical-terms/musical-terms.component';

const routes: Routes = [
	{
		path: 'parent',
		component: ParentComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				redirectTo: 'students',
				pathMatch: 'full'
			},
			{
				path: 'account',
				component: AccountComponent
			},
			{
				path: 'messages',
				component: MessagesComponent
			},
			{
				path: 'students',
				component: StudentPSectionComponent
			},
			{
				path: 'students/:sid',	component: ParentStudentDetails
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
				path: 'search',
				redirectTo: 'search/colleges'
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
				path:'settings',
				component:SettingsComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ParentRoutingModule {}
