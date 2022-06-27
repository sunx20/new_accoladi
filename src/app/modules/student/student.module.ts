import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { StudentComponent } from './student.component';
import { ProfileComponent } from './../shared/components/profile/profile.component';
import { StudentAccountComponent } from './../shared/components/profile/account/student-account.component';
import { ParentSponsorComponent } from './../shared/components/profile/parent-sponsor/parent-sponsor.component';
import { TalentComponent } from './../shared/components/profile/talent/talent.component';
import { AddTalentModalComponent } from './../shared/components/profile/talent/add-talent-modal/add-talent-modal.component';
import { UpdateTalentModalComponent } from './../shared/components/profile/talent/update-talent-modal/update-talent-modal.component';
import { DeleteTalentModalComponent } from './../shared/components/profile/talent/delete-talent-modal/delete-talent-modal.component';
import { PerformanceComponent } from './../shared/components/performance/performance.component';
import { GeneralPerformanceComponent } from './../shared/components/performance/general-performance/general-performance.component';
import { AddPerformanceModalComponent } from './../shared/components/performance/general-performance/add-performance-modal/add-performance-modal.component';
import { UpdatePerformanceModalComponent } from './../shared/components/performance/general-performance/update-performance-modal/update-performance-modal.component';
import { DeletePerformanceModalComponent } from './../shared/components/performance/general-performance/delete-performance-modal/delete-performance-modal.component';

import { FestivalCompetitionComponent } from './../shared/components/performance/festival-competition/festival-competition.component';
import { AddFCModalComponent } from './../shared/components/performance/festival-competition/add-festival-competition-modal/add-festival-competition-modal.component';
import { UpdateFCModalComponent } from './../shared/components/performance/festival-competition/update-festival-competition-modal/update-festival-competition-modal.component';
import { DeleteFCModalComponent } from './../shared/components/performance/festival-competition/delete-festival-competition-modal/delete-festival-competition-modal.component';
import { PrivateStudyComponent } from './../shared/components/performance/private-study/private-study.component';
import { AddPrivateStudyModalComponent } from './../shared/components/performance/private-study/add-private-study-modal/add-private-study-modal.component';
import { UpdatePrivateStudyModalComponent } from './../shared/components/performance/private-study/update-private-study-modal/update-private-study-modal.component';
import { DeletePrivateStudyModalComponent } from './../shared/components/performance/private-study/delete-private-study-modal/delete-private-study-modal.component';
import { SummerEnrichmentComponent } from './../shared/components/performance/summer-enrichment/summer-enrichment.component';
import { AddSummerEnrichmentModalComponent } from './../shared/components/performance/summer-enrichment/add-summer-enrichment-modal/add-summer-enrichment-modal.component';
import { UpdateSummerEnrichmentModalComponent } from './../shared/components/performance/summer-enrichment/update-summer-enrichment-modal/update-summer-enrichment-modal.component';
import { DeleteSummerEnrichmentModalComponent } from './../shared/components/performance/summer-enrichment/delete-summer-enrichment-modal/delete-summer-enrichment-modal.component';
import { HonorAwardComponent } from './../shared/components/performance/honor-award/honor-award.component';
import { AddHonorAwardModalComponent } from './../shared/components/performance/honor-award/add-honor-award-modal/add-honor-award-modal.component';
import { UpdateHonorAwardModalComponent } from './../shared/components/performance/honor-award/update-honor-award-modal/update-honor-award-modal.component';
import { DeleteHonorAwardModalComponent } from './../shared/components/performance/honor-award/delete-honor-award-modal/delete-honor-award-modal.component';
import { MusicalTheaterComponent } from './../shared/components/performance/musical-theater/musical-theater.component';
import { AddMusicalTheaterModalComponent } from './../shared/components/performance/musical-theater/add-musical-theater-modal/add-musical-theater-modal.component';
import { UpdateMusicalTheaterModalComponent } from './../shared/components/performance/musical-theater/update-musical-theater-modal/update-musical-theater-modal.component';
import { DeleteMusicalTheaterModalComponent } from './../shared/components/performance/musical-theater/delete-musical-theater-modal/delete-musical-theater-modal.component';
import { MasterClassComponent } from '../shared/components/education/master-class/master-class.component';
import { AddMasterClassModalComponent } from '../shared/components/education/master-class/add-master-class-modal/add-master-class-modal.component';
import { UpdateMasterClassModalComponent } from '../shared/components/education/master-class/update-master-class-modal/update-master-class-modal.component';
import { DeleteMasterClassModalComponent } from '../shared/components/education/master-class/delete-master-class-modal/delete-master-class-modal.component';
import { MusicalClassComponent } from '../shared/components/education/musical-class/musical-class.component';
import { UpdateMusicalClassModalComponent } from '../shared/components/education/musical-class/update-musical-class-modal/update-musical-class-modal.component';
import { EducationSchoolComponent } from '../shared/components/education/education-school/education-school.component';
import { AddESModalComponent } from '../shared/components/education/education-school/add-education-school-modal/add-education-school-modal.component';
import { UpdateESModalComponent } from '../shared/components/education/education-school/update-education-school-modal/update-education-school-modal.component';
import { DeleteESModalComponent } from '../shared/components/education/education-school/delete-education-school-modal/delete-education-school-modal.component';
import { CollegePreferenceComponent } from '../shared/components/education/college-preference/college-preference.component';
import { UpdateCPModalComponent } from '../shared/components/education/college-preference/update-college-preference-modal/update-college-preference-modal.component';
import { UpdatePSModalComponent } from '../shared/components/education/personal-statement/update-personal-statement-modal/update-personal-statement-modal.component';
import { ScholasticInformationComponent } from '../shared/components/education/scholastic-information/scholastic-information.component';
import { UpdateSIModalComponent } from '../shared/components/education/scholastic-information/update-scholastic-information-modal/update-scholastic-information-modal.component';
import { PersonalStatementComponent } from '../shared/components/education/personal-statement/persoanl-statement.component';
import { LetterComponent } from '../shared/components/letter/letter.component';
import { SendLetterModalComponent } from '../shared/components/letter/send-letter-modal/send-letter-modal.component';
import { UpdateStudentAccountModalComponent } from './../shared/components/profile/account/update-student-account-modal/update-student-account-modal.component';
import { StudentSidebarComponent } from './sidebar/student-sidebar.component';
import { StudentMessagesComponent } from './../shared/components/profile/messages/messages.component';
import { EducationComponent } from '../shared/components/education/education.component';
import { ResourcesComponent } from './resources/resources.component';
import { HelpComponent } from './resources/help/help.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { PDFsComponent } from './resources/pdfs/pdfs.component';
import { VideosComponent } from './resources/videos/videos.component';
import { FullProfileComponent } from './../shared/components/profile/full-profile/full-profile.component';
import { StudentWrapperComponent } from './../shared/components/profile/full-profile/student-wrapper.component';

import { TalentModel } from './models/talent.model';
import { EducationModel } from './models/education.model';
import { PerformanceModel } from './models/performance.model';
import { HonorAwardModel } from './models/honor-award.model';
import { FestivalCompetitionModel } from './models/festival-competition.model';
import { MusicalTheaterModel } from './models/musical-theater.model';
import { PrivateStudyModel } from './models/private-study.model';
import { MasterClassModel } from './models/master-class.model';
import { SummerEnrichmentModel } from './models/summer-enrichment.model';
import { MusicalClassModel } from './models/musical-class.model';
import { ScholasticModel } from './models/scholastic.model';

import { TalentService } from './services/talent.service';
import { StudentService } from './services/student.service';
import { CollegePreferenceService } from './services/college-preference.service';
import { GeneralPerformanceService } from './services/general-performance.service';
import { FestivalCompetitionService } from './services/festival-competition.service';
import { PrivateStudyService } from './services/private-study.service';
import { SummerEnrichmentService } from './services/summer-enrichment.service';
import { HonorAwardService } from './services/honor-award.service';
import { MusicalTheaterService } from './services/musical-theater.service';
import { MasterClassService } from './services/master-class.service';
import { MusicalClassService } from './services/musical-class.service';
import { EducationSchoolService } from './services/education-school.service';
import { ScholasticInformationService } from './services/scholastic-information.service';
import { PersonalStatementService } from './services/personal-statement.service';

import { SharedModule, RateComponent } from '../shared/shared.module';
import { StudentRoutingModule } from './student-routing.module';
import { NewEducationSchoolModelComponent } from '../shared/components/education/education-school/new-education-school-model/new-education-school-model.component';
import { SigningDayService } from './services/signing-day.service';
import { DanceService } from './services/dance.service';
import { AddDanceModelComponent } from '../shared/components/performance/dance/add-dance-model/add-dance-model.component';
import { DeleteDanceModelComponent } from '../shared/components/performance/dance/delete-dance-model/delete-dance-model.component';
import { UpdateDanceModelComponent } from '../shared/components/performance/dance/update-dance-model/update-dance-model.component';
import { DanceModel } from './models/dance.model';
import { DanceComponent } from '../shared/components/performance/dance/dance.component';

import { CampSearchService } from './services/camp-search.service';

@NgModule({
	bootstrap: [StudentComponent],
	imports: [
		BrowserModule,
		CommonModule,
		StudentRoutingModule,
		NgbModule.forRoot(),
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule
	],
	declarations: [
		StudentComponent,
		ProfileComponent,
		FullProfileComponent,
		StudentWrapperComponent,
		StudentAccountComponent,
		ParentSponsorComponent,
		TalentComponent,
		AddTalentModalComponent,
		UpdateTalentModalComponent,
		DeleteTalentModalComponent,
		StudentAccountComponent,
		UpdateStudentAccountModalComponent,
		PerformanceComponent,
		GeneralPerformanceComponent,
		AddPerformanceModalComponent,
		UpdatePerformanceModalComponent,
		DeletePerformanceModalComponent,
		FestivalCompetitionComponent,
		AddFCModalComponent,
		UpdateFCModalComponent,
		DeleteFCModalComponent,
		PrivateStudyComponent,
		AddPrivateStudyModalComponent,
		UpdatePrivateStudyModalComponent,
		DeletePrivateStudyModalComponent,
		SummerEnrichmentComponent,
		AddSummerEnrichmentModalComponent,
		UpdateSummerEnrichmentModalComponent,
		DeleteSummerEnrichmentModalComponent,
		HonorAwardComponent,
		AddHonorAwardModalComponent,
		UpdateHonorAwardModalComponent,
		DeleteHonorAwardModalComponent,
		MusicalTheaterComponent,
		AddMusicalTheaterModalComponent,
		UpdateMusicalTheaterModalComponent,
		DeleteMusicalTheaterModalComponent,
		MasterClassComponent,
		AddMasterClassModalComponent,
		UpdateMasterClassModalComponent,
		DeleteMasterClassModalComponent,
		MusicalClassComponent,
		UpdateMusicalClassModalComponent,
		EducationComponent,
		EducationSchoolComponent,
		AddESModalComponent,
		UpdateESModalComponent,
		DeleteESModalComponent,
		CollegePreferenceComponent,
		UpdateCPModalComponent,
		PersonalStatementComponent,
		UpdatePSModalComponent,
		ScholasticInformationComponent,
		UpdateSIModalComponent,
		ResourcesComponent,
		FaqsComponent,
		HelpComponent,
		PDFsComponent,
		VideosComponent,
		LetterComponent,
		SendLetterModalComponent,
		StudentSidebarComponent,
		StudentMessagesComponent,
		NewEducationSchoolModelComponent,
		AddDanceModelComponent,
		UpdateDanceModelComponent,
		DeleteDanceModelComponent,
		// ViewedCollagesComponent,
	],
	providers: [
		StudentService,
		TalentService,
		GeneralPerformanceService,
		FestivalCompetitionService,
		PrivateStudyService,
		SummerEnrichmentService,
		HonorAwardService,
		MusicalTheaterService,
		DanceService,
		MasterClassService,
		MusicalClassService,
		EducationSchoolService,
		CollegePreferenceService,
		PersonalStatementService,
		ScholasticInformationService,
		NgbActiveModal, SigningDayService,
		CampSearchService
	],
	entryComponents: [
		AddTalentModalComponent,
		UpdateTalentModalComponent,
		DeleteTalentModalComponent,
		UpdateStudentAccountModalComponent,
		AddPerformanceModalComponent,
		UpdatePerformanceModalComponent,
		DeletePerformanceModalComponent,
		AddFCModalComponent,
		UpdateFCModalComponent,
		DeleteFCModalComponent,
		AddPrivateStudyModalComponent,
		UpdatePrivateStudyModalComponent,
		DeletePrivateStudyModalComponent,
		AddHonorAwardModalComponent,
		UpdateHonorAwardModalComponent,
		DeleteHonorAwardModalComponent,
		AddSummerEnrichmentModalComponent,
		UpdateSummerEnrichmentModalComponent,
		DeleteSummerEnrichmentModalComponent,
		UpdateMusicalClassModalComponent,
		AddMasterClassModalComponent,
		UpdateMasterClassModalComponent,
		DeleteMasterClassModalComponent,
		AddMusicalTheaterModalComponent,
		UpdateMusicalTheaterModalComponent,
		DeleteMusicalTheaterModalComponent,
		UpdatePSModalComponent,
		UpdateCPModalComponent,
		AddESModalComponent,
		UpdateESModalComponent,
		DeleteESModalComponent,
		UpdateSIModalComponent,
		NewEducationSchoolModelComponent,
		AddDanceModelComponent,
		UpdateDanceModelComponent,
		DeleteDanceModelComponent,
		SendLetterModalComponent
	],
	exports: [
		ProfileComponent,
		FullProfileComponent,
		TalentComponent,
		HonorAwardComponent,
		SummerEnrichmentComponent,
		MusicalTheaterComponent,
		MusicalClassComponent,
		GeneralPerformanceComponent,
		FestivalCompetitionComponent,
		MasterClassComponent,
		CollegePreferenceComponent,
		PersonalStatementComponent,
		ScholasticInformationComponent,
		EducationSchoolComponent,
		PrivateStudyComponent,
		AddDanceModelComponent,
		UpdateDanceModelComponent,
		DeleteDanceModelComponent,
		SendLetterModalComponent
	]
})

export class StudentModule {}

export {
	StudentService,
	GeneralPerformanceService,
	FestivalCompetitionService,
	PrivateStudyService,
	SummerEnrichmentService,
	HonorAwardService,
	MusicalTheaterService,
	DanceService,
	MasterClassService,
	MusicalClassService,
	EducationSchoolService,
	CollegePreferenceService,
	PersonalStatementService,
	ScholasticInformationService,
	TalentModel,
	EducationModel,
	PerformanceModel,
	HonorAwardModel,
	FestivalCompetitionModel,
	MusicalTheaterModel,
	DanceModel,
	PrivateStudyModel,
	MasterClassModel,
	SummerEnrichmentModel,
	MusicalClassModel,
	ScholasticModel,
	FullProfileComponent
};