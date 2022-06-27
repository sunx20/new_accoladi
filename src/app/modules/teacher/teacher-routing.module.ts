import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { TeacherComponent } from './teacher.component';

import { ResourcesComponent } from './resources/resources.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { HelpComponent } from './resources/help/help.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';
import { StudentSectionComponent } from './student-section/student-section.component';

import { ProfileComponent } from '../shared/components/profile/profile.component';
import { MusicalTheaterComponent } from '../shared/components/performance/musical-theater/musical-theater.component';
import { DanceComponent } from '../shared/components/performance/dance/dance.component';
import { GeneralPerformanceComponent } from '../shared/components/performance/general-performance/general-performance.component';
import { SummerEnrichmentComponent } from '../shared/components/performance/summer-enrichment/summer-enrichment.component';
import { FestivalCompetitionComponent } from '../shared/components/performance/festival-competition/festival-competition.component';
import { HonorAwardComponent } from '../shared/components/performance/honor-award/honor-award.component';
import { PerformanceComponent } from '../shared/components/performance/performance.component';
import { StudentWrapperComponent } from '../shared/components/profile/full-profile/student-wrapper.component';
import { TalentComponent } from '../shared/components/profile/talent/talent.component';
import { ParentSponsorComponent } from '../shared/components/profile/parent-sponsor/parent-sponsor.component';
import { StudentAccountComponent } from '../shared/components/profile/account/student-account.component';
import { PersonalStatementComponent } from '../shared/components/education/personal-statement/persoanl-statement.component';
import { ScholasticInformationComponent } from '../shared/components/education/scholastic-information/scholastic-information.component';
import { CollegePreferenceComponent } from '../shared/components/education/college-preference/college-preference.component';
import { PrivateStudyComponent } from '../shared/components/performance/private-study/private-study.component';
import { MasterClassComponent } from '../shared/components/education/master-class/master-class.component';
import { MusicalClassComponent } from '../shared/components/education/musical-class/musical-class.component';
import { EducationSchoolComponent } from '../shared/components/education/education-school/education-school.component';
import { EducationComponent } from '../shared/components/education/education.component';

import {
	AccountComponent,
	CollegeSearchComponent,
	ScholarshipSearchComponent,
	PremierProgramSearchComponent,
	MessagesComponent,
	SettingsComponent,
	ViewedCollagesComponent
} from '../shared/shared.module';

import { HomeComponent } from '../shared/components/home/home.component';
import { MusicHistoryGuidsComponent } from '../shared/components/music-history-guids/music-history-guids.component';
import { MusicalTermsComponent } from '../shared/components/musical-terms/musical-terms.component';

const routes: Routes = [
	{
		path: 'teacher',
		component: TeacherComponent,
		canActivate: [
			AuthGuard
		],
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'home',
				component: HomeComponent
			},
			{
				path: 'account',
				component: AccountComponent
			},
			{
				path: 'profile/home',
				component: HomeComponent
			},
			{
				path: 'profile',
				component: ProfileComponent
			},
			{
				path: 'profile/account',
				component: StudentAccountComponent
			},
			{
				path: 'profile/parent-sponsor',
				component: ParentSponsorComponent
			},
			{
				path: 'profile/talents',
				component: TalentComponent
			},
			{
				path: 'full-profile',
				component: StudentWrapperComponent
			},
			{
				path: 'performance',
				component: PerformanceComponent
			},
			{
				path: 'performance/honors-awards',
				component: HonorAwardComponent
			},
			{
				path: 'performance/festivals-competitions',
				component: FestivalCompetitionComponent
			},
			{
				path: 'performance/summer-enrichment',
				component: SummerEnrichmentComponent
			},
			{
				path: 'performance/general',
				component: GeneralPerformanceComponent
			},
			{
				path: 'performance/musical-theater',
				component: MusicalTheaterComponent
			},
			{
				path: 'performance/dance',
				component: DanceComponent
			},
			{
				path: 'education',
				component: EducationComponent
			},
			{
				path: 'education/schools',
				component: EducationSchoolComponent
			},
			{
				path: 'education/musical-classes',
				component: MusicalClassComponent
			},
			{
				path: 'education/master-classes',
				component: MasterClassComponent
			},
			{
				path: 'education/private-studies',
				component: PrivateStudyComponent
			},
			{
				path: 'education/college-preferences',
				component: CollegePreferenceComponent
			},
			{
				path: 'education/scholastic-information',
				component: ScholasticInformationComponent
			},
			{
				path: 'education/personal-statement',
				component: PersonalStatementComponent
			},
			{
				path: 'messages',
				component: MessagesComponent
			},
			{
				path: 'students',
				component: StudentSectionComponent
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
				path: 'resources/music-history',
				component: MusicHistoryGuidsComponent
			},
			{
				path: 'resources/musical-terms',
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
				path: 'viewed/colleges',
				component: ViewedCollagesComponent
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
				path: 'settings',
				component: SettingsComponent
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

export class TeacherRoutingModule { }