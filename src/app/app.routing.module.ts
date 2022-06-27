import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
	AboutComponent,
	AdvantagesComponent,
	ArticlesComponent,
	AuditionRequirementsComponent,
	BillingComponent,
	CampsSearchComponent,
	CollegeSearchComponent,
	ExamComponent,
	FastTrackComponent,
	FeatureComponent,
	GetConnectedComponent,
	GradeByGradeGuideComponent,
	HowComponent,
	InstitutionalScholarshipsComponent,
	InviteActionComponent,
	InviteComponent,
	MessagesComponent,
	NonInstitutionalScholarshipsComponent,
	MusicalTermsComponent,
	MusicHistoryGuidsComponent,
	OverviewComponent,
	PaymentComponent,
	PremierProgramsComponent,
	PremierProgramSearchComponent,
	PremiumComponent,
	PublicComponent,
	RecruitersComponent,
	RepertoireSearchComponent,
	RequirementsComponent,
	ResourcesComponent,
	ScholarshipSearchComponent,
	SoarComponent,
	StudentsComponent,
	SuccessComponent,
	TeachersComponent,
	TeachingMomentsComponent,
	WhatComponent,
	WhoComponent,
	WhyComponent,
	ZzzComponent
} from './modules/shared/shared.module';

import { ScholarshipsComponent } from './modules/shared/components/scholarships/scholarships.component';
import { CollegesComponent } from './modules/shared/components/colleges/colleges.component';

import { AuthGuard } from './modules/auth/auth.guard';

// Set routes
const appRoutes: Routes = [
	{
		path: 'messages',
		component: MessagesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'messages/:recipient',
		component: MessagesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'invite',
		component: InviteComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'college-search',
		component: CollegeSearchComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'colleges/:state',
		component: CollegesComponent
	},
	{
		path: 'colleges/:state/:name',
		component: CollegesComponent
	},
	{
		path: 'scholarship-search',
		component: ScholarshipSearchComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'premier-program-search',
		component: PremierProgramSearchComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'billing',
		component: BillingComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'invite/:key',
		component: InviteActionComponent
	},
	{
		path: 'payment/:response',
		component: PaymentComponent
	},
	{
		path: 'premium',
		component: PremiumComponent
	},
	{
		path: 'scholarships',
		component: ScholarshipsComponent
	},
	{
		path: 'scholarships/:state',
		component: ScholarshipsComponent
	},
	{
		path: 'scholarships/:state/:name',
		component: ScholarshipsComponent
	},
	{
		path: 'resources/music-history',
		component: MusicHistoryGuidsComponent
	},
	{
		path: 'resources/musical-terms',
		component: MusicalTermsComponent
	},	
// public stuff...
	{
		path: 'public',
		component: PublicComponent
	},
	{
		path: 'public/about',
		component: AboutComponent
	},
	{
		path: 'public/articles',
		component: ArticlesComponent
	},
	{
		path: 'public/articles/:articleTitle',
		component: ArticlesComponent
	},
	{
		path: 'public/audition-requirements',
		component: AuditionRequirementsComponent
	},
	{
		path: 'public/audition-requirements/:auditionTitle',
		component: AuditionRequirementsComponent
	},
	{
		path: 'public/resources',
		component: ResourcesComponent
	},
	{
		path: 'public/advantages',
		component: AdvantagesComponent
	},
	{
		path: 'public/fast-track',
		component: FastTrackComponent
	},
	{
		path: 'public/fast-track/:week',
		component: FastTrackComponent
	},
	{
		path: 'public/who',
		component: WhoComponent
	},
	{
		path: 'public/what',
		component: WhatComponent
	},
	{
		path: 'public/why',
		component: WhyComponent
	},
	{
		path: 'public/how',
		component: HowComponent
	},
	{
		path: 'public/students',
		component: StudentsComponent
	},
	{
		path: 'public/teachers',
		component: TeachersComponent
	},
	{
		path: 'public/success',
		component: SuccessComponent
	},
	{
		path: 'public/teaching-moments',
		component: TeachingMomentsComponent
	},
	{
		path: 'public/higher-ed',
		component: RecruitersComponent
	},
	{
		path: 'public/get-connected',
		component: GetConnectedComponent
	},
	{
		path: 'public/overview',
		component: OverviewComponent
	},
	{
		path: 'public/requirements',
		component: RequirementsComponent
	},
	{
		path: 'public/requirements/:talent',
		component: RequirementsComponent
	},
	{
		path: 'public/exam',
		component: ExamComponent
	},
	{
		path: 'public/feature/:type',
		component: FeatureComponent
	},
	{
		path: 'public/repertoire_search',
		component: RepertoireSearchComponent
	},
	{
		path: 'public/summer-camp-search',
		component: CampsSearchComponent
	},
	{
		path: 'public/soar',
		component: SoarComponent
	},		
	{
		path: 'public/premier-programs',
		component: PremierProgramsComponent
	},	
	{
		path: 'public/non-institutional-scholarships',
		component: NonInstitutionalScholarshipsComponent
	},	
	{
		path: 'public/institutional-scholarships',
		component: InstitutionalScholarshipsComponent
	},
	{
		path: 'public/grade-guide',
		component: GradeByGradeGuideComponent
	},
	{
		path: 'public/zzz',
		component: ZzzComponent
	},

	{
		path: '**',
		redirectTo: 'public'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes,{scrollPositionRestoration: 'enabled'})],
	exports: [RouterModule]
})

export class AppRoutingModule { }