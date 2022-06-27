import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';

import { StudentComponent } from './student.component';

import { ProfileComponent } from './../shared/components/profile/profile.component';
import { StudentAccountComponent } from './../shared/components/profile/account/student-account.component';
import { ParentSponsorComponent } from './../shared/components/profile/parent-sponsor/parent-sponsor.component';
import { TalentComponent } from './../shared/components/profile/talent/talent.component';
import { StudentMessagesComponent } from './../shared/components/profile/messages/messages.component';
import { PerformanceComponent } from './../shared/components/performance/performance.component';
import { GeneralPerformanceComponent } from './../shared/components/performance/general-performance/general-performance.component';
import { HonorAwardComponent } from './../shared/components/performance/honor-award/honor-award.component';
import { FestivalCompetitionComponent } from './../shared/components/performance/festival-competition/festival-competition.component';
import { SummerEnrichmentComponent } from './../shared/components/performance/summer-enrichment/summer-enrichment.component';
import { PrivateStudyComponent } from './../shared/components/performance/private-study/private-study.component';
import { MusicalClassComponent } from './../shared/components/education/musical-class/musical-class.component';
import { MasterClassComponent } from './../shared/components/education/master-class/master-class.component';
import { MusicalTheaterComponent } from './../shared/components/performance/musical-theater/musical-theater.component';
import { EducationComponent } from './../shared/components/education/education.component';
import { EducationSchoolComponent } from './../shared/components/education/education-school/education-school.component';
import { CollegePreferenceComponent } from './../shared/components/education/college-preference/college-preference.component';
import { ScholasticInformationComponent } from './../shared/components/education/scholastic-information/scholastic-information.component';

import { PersonalStatementComponent } from './../shared/components/education/personal-statement/persoanl-statement.component';
import { LetterComponent } from '../shared/components/letter/letter.component';

import { ResourcesComponent } from './resources/resources.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { HelpComponent } from './resources/help/help.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';

import { StudentWrapperComponent } from './../shared/components/profile/full-profile/student-wrapper.component';
import { StudentDetails } from '../recruiter/student-details/student-details.component';

import { HomeComponent } from '../shared/components/home/home.component';

import {
	CollegeSearchComponent,
	ScholarshipSearchComponent,
	PremierProgramSearchComponent,
	SettingsComponent,
	PremiumComponent,
} from '../shared/shared.module';

import { SigningDayComponent } from '../shared/components/signing-day/signing-day.component';
import { DanceComponent } from '../shared/components/performance/dance/dance.component';
import { ViewedCollagesComponent } from '../shared/components/viewed-collages/viewed-collages.component';
import { CampsSearchComponent } from '../shared/components/camps-search/camps-search.component';
import { MusicHistoryGuidsComponent } from '../shared/components/music-history-guids/music-history-guids.component';
import { MusicalTermsComponent } from '../shared/components/musical-terms/musical-terms.component';

const routes: Routes = [
	{
		path: 'student',
		component: StudentComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				component: HomeComponent // StudentWrapperComponent
			},
			{
				path: 'home',
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
				path: 'education/letters',
				component: LetterComponent
			},
			{
				path: 'profile/messages',
				component: StudentMessagesComponent
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
			},
			{
				path: 'premium',
				component: PremiumComponent
			},
			{
				path: 'share/student/:sid',
				component: StudentDetails
			},
			{
				path: 'performance/dance',
				component: DanceComponent
			},
			{
				path: 'signingday',
				component: SigningDayComponent
			},
			{
				path: 'camp',
				component: CampsSearchComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class StudentRoutingModule { }