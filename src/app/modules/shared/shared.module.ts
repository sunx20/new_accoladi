import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from '@ng-select/ng-select';

import { MomentModule } from "ngx-moment";
import { ToastrModule } from "ngx-toastr";

import { DisableDoubleClickDirective } from "./directives/disable-double-click.directive";
import { httpInterceptProviders } from "./http-interceptors";
import { NgbdSortableHeader, SortEvent } from "./directives/sortable.directive";
import { ReplacePipe } from './pipes/replace';
import { ValidateEmailNotTaken, CustomValidators } from "./validators/custom.validator";

import { InviteModel } from "./models/invite.model";
import { StateModel } from "./models/state.model";
import { UserModel } from "./models/user.model";

import { CatalogService } from "./services/catalog.service";
import { CollegePreferenceService } from '../student/services/college-preference.service';
import { CollegeService } from "./services/college.service";
import { DataService } from "./services/data.service";
import { GoogleAnalyticsEventsService } from "./services/ga.event.service";
import { InviteService } from "./services/invite.service";
import { LetterService } from '../student/services/letter.service';
import { LocationService } from "./services/location.service";
import { MessagesService } from "./services/messages.service";
import { PaymentService } from "./services/payment.service";
import { PremierProgramService } from "./services/premier-program.service";
import { ScholarshipService } from "./services/scholarship.service";
import { SchoolService } from "./services/school.service";
import { UserService } from "./services/user.service";

import { AccountComponent } from "./components/account/account.component";
import { AddCompositionInformationComponent } from './components/add-composition-information/add-composition-information.component';
import { AddMusicalTermComponent } from './components/musical-terms/add-musical-term/add-musical-term.component';
import { AddNewSchoolComponent } from './components/wizard/add-new-school/add-new-school.component';
import { AddressProfileComponent } from './components/wizard/address-profile/address-profile.component';
import { BillingComponent } from "./components/billing/billing.component";
import { CampsSearchComponent } from './components/camps-search/camps-search.component';
import { CollegeDetailsModalComponent } from "./components/college-search/college-details-modal/college-details-modal.component";
import { CollegePreferenceProfileComponent } from './components/wizard/college-preference-profile/college-preference-profile.component';
import { CollegeSavedComponent } from "./components/college-search/college-saved/college-saved.component";
import { CollegeSearchComponent } from "./components/college-search/college-search.component";
import { CollegesComponent } from "./components/colleges/colleges.component";
import { DanceComponent } from "./components/performance/dance/dance.component";
import { DatesProfileComponent } from './components/wizard/dates-profile/dates-profile.component';
import { DeleteConversationModalComponent } from "./components/messages/delete-conversation-modal/delete-conversation-modal.component";
import { EditUserInfoModalComponent } from "./components/settings/edit-user-info/edit-user-info-modal.component";
import { EditContactInfoComponent } from "./components/settings/edit-contact-info/edit-contact-info.component";
import { EditDemographicInfoComponent } from "./components/settings/edit-demographic-info/edit-demographic-info.component";
import { EditPersonalInfoComponent } from "./components/settings/edit-personal-info/edit-personal-info.component";
import { ChangePasswordModalComponent } from "./components/settings/change-password/change-password-modal.component";
import { EnsembleInterestMilitaryProfileComponent } from './components/wizard/ensemble-interest-military-profile/ensemble-interest-military-profile.component';
import { EnterConversationModalComponent } from "./components/messages/enter-conversation-modal/enter-conversation-modal.component";
import { EulaModalComponent } from "./components/eula/eula.component";
import { FieldErrorDisplayComponent } from "./components/field-error-display/field-error-display.component";
import { InviteActionComponent } from "./components/invite/invite-action.component";
import { InviteComponent } from "./components/invite/invite.component";
import { InviteModalComponent } from './components/profile/parent-sponsor/invite/invite-modal.component';
import { JudgeModalComponent } from './components/judge-nsd/judge-modal.component';
import { JudgeNSDComponent } from "./components/judge-nsd/judge-nsd.component";
import { JudgeNsdGeneralComponent } from './components/judge-nsd/judge-nsd-general/judge-nsd-general.component';
import { JudgeNsdKeyboardComponent } from './components/judge-nsd/judge-nsd-keyboard/judge-nsd-keyboard.component';
import { JudgeNsdMusicalTheaterComponent } from './components/judge-nsd/judge-nsd-musical-theater/judge-nsd-musical-theater.component';
import { JudgeNsdSubgridComponent } from './components/judge-nsd/judge-nsd-subgrid/judge-nsd-subgrid.component';
import { JudgeNsdVoiceComponent } from './components/judge-nsd/judge-nsd-voice/judge-nsd-voice.component';
import { JudgeNsdWindStringComponent } from './components/judge-nsd/judge-nsd-wind-string/judge-nsd-wind-string.component';
import { MessagesComponent } from "./components/messages/messages.component";
import { MusicalTermsComponent } from './components/musical-terms/musical-terms.component';
import { MusicHistoryGuidsComponent } from './components/music-history-guids/music-history-guids.component';
import { PageNotFoundComponent } from "./components/404/404.component";
import { ParentProfileComponent } from './components/wizard/parent-profile/parent-profile.component';
import { ParentWizardComponent } from './components/wizard/parent-wizard/parent-wizard.component';
import { PaymentComponent } from "./components/billing/payment/payment.component";
import { PremierProgramDetailsModalComponent } from "./components/premier-program-search/premier-program-details-modal/premier-program-details-modal.component";
import { PremierProgramSavedComponent } from "./components/premier-program-search/premier-program-saved/premier-program-saved.component";
import { PremierProgramSearchComponent } from "./components/premier-program-search/premier-program-search.component";
import { PremiumComponent } from "./components/billing/premium/premium.component";
import { RateComponent } from "./components/rate/rate.component";
import { RenewalPopupComponent } from "./components/settings/renewal-popup/renewal-popup.component";
import { RepertoireSearchComponent } from './components/repertoire-search/repertoire-search.component';
import { SaveStripeCardComponent } from "./components/billing/save-stripe-card/save-stripe-card.component";
import { ScholarshipDetailsModalComponent } from "./components/scholarship-search/scholarship-details-modal/scholarship-details-modal.component";
import { ScholarshipSavedComponent } from "./components/scholarship-search/scholarship-saved/scholarship-saved.component";
import { ScholarshipSearchComponent } from "./components/scholarship-search/scholarship-search.component";
import { ScholarshipsComponent } from "./components/scholarships/scholarships.component";
import { SchoolProfileComponent } from './components/wizard/school-profile/school-profile.component';
import { SettingsComponent } from "./components/settings/settings.component";
import { SideBarComponent } from "./side-bar/side-bar.component";
import { SigningDayAlertComponent } from "./components/signing-day/signing-day-alert/signing-day-alert.component";
import { SigningDayAuditionComponent } from "./components/signing-day/signing-day-audition/signing-day-audition.component";
import { SigningDayComponent } from "./components/signing-day/signing-day.component";
import { SigningDayMusicalTheatreComponent } from "./components/signing-day/signing-day-musical-theatre/signing-day-musical-theatre.component";
import { SigningDayPerformanceComponent } from "./components/signing-day/signing-day-performance/signing-day-performance.component";
import { StripePayComponent } from "./components/billing/stripe-pay/stripe-pay.component";
import { TalentProfileComponent } from './components/wizard/talent-profile/talent-profile.component';
import { UpdateAccountModalComponent } from "./components/account/update-account-modal/update-account-modal.component";
import { VideoPlayerModalComponent } from "./components/video-player/video-player.component";
import { ViewedCollagesComponent } from './components/viewed-collages/viewed-collages.component';

import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

import { AboutComponent } from './components/public/about.component';
import { AdvantagesComponent } from './components/public/advantages.component';
import { ArticlesComponent } from './components/public/articles.component';
import { ExamComponent } from './components/public/exam.component';
import { FeatureComponent } from './components/public/feature.component';
import { GetConnectedComponent } from './components/public/getconnected.component';
import { HomeComponent } from "./components/home/home.component";
import { HowComponent } from './components/public/how.component';
import { InstitutionalScholarshipsComponent } from './components/public/institutional-scholarships.component';
import { NonInstitutionalScholarshipsComponent } from './components/public/non-institutional-scholarships.component';
import { OverviewComponent } from './components/public/overview.component';
import { PremierProgramsComponent } from './components/public/premier-programs.component';
import { PublicComponent } from './components/public/public.component';
import { RecruitersComponent } from './components/public/recruiters.component';
import { RequirementsComponent } from './components/public/requirements.component';
import { ResourcesComponent } from './components/public/resources.component';
import { StudentsComponent } from './components/public/students.component';
import { TeachersComponent } from './components/public/teachers.component';
import { WhatComponent } from './components/public/what.component';
import { WhoComponent } from './components/public/who.component';
import { WhyComponent } from './components/public/why.component';
import { FastTrackComponent } from './components/public/fasttrack.component';
import { AuditionRequirementsComponent } from './components/public/audition-requirements.component';
import { SoarComponent } from './components/public/soar.component';
import { TeachingMomentsComponent } from './components/public/teaching-moments.component';
import { SuccessComponent } from './components/public/success.component';
import { GradeByGradeGuideComponent } from './components/public/grade-by-grade-guide.component';
import { ZzzComponent } from './components/public/zzz.component';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		DropDownsModule,
		FormsModule,
		GridModule,
		MomentModule,
		MomentModule,
		NgbModule,
		NgbModule,
		NgSelectModule,
		ReactiveFormsModule,
		ReactiveFormsModule,
		RouterModule,
		ToastrModule.forRoot({
			positionClass: "toast-bottom-right",
			closeButton: true
		})
	],
	declarations: [
		AccountComponent,
		AddCompositionInformationComponent,
		AddMusicalTermComponent,
		AddNewSchoolComponent,
		AddressProfileComponent,
		BillingComponent,
		CampsSearchComponent,
		CollegeDetailsModalComponent,
		CollegePreferenceProfileComponent,
		CollegeSavedComponent,
		CollegesComponent,
		CollegeSearchComponent,
		DanceComponent,
		DatesProfileComponent,
		DeleteConversationModalComponent,
		DisableDoubleClickDirective,
		EditUserInfoModalComponent,
		EditContactInfoComponent,
		EditDemographicInfoComponent,
		EditPersonalInfoComponent,
		ChangePasswordModalComponent,
		EnsembleInterestMilitaryProfileComponent,
		EnterConversationModalComponent,
		EulaModalComponent,
		FieldErrorDisplayComponent,
		FooterComponent,
		HeaderComponent,
		HomeComponent,
		InviteActionComponent,
		InviteComponent,
		InviteModalComponent,
		JudgeModalComponent,
		JudgeNSDComponent,
		JudgeNsdGeneralComponent,
		JudgeNsdKeyboardComponent,
		JudgeNsdMusicalTheaterComponent,
		JudgeNsdSubgridComponent,
		JudgeNsdVoiceComponent,
		JudgeNsdWindStringComponent,
		MessagesComponent,
		MusicalTermsComponent,
		MusicHistoryGuidsComponent,
		NgbdSortableHeader,
		PageNotFoundComponent,
		ParentProfileComponent,
		ParentWizardComponent,
		PaymentComponent,
		PremierProgramDetailsModalComponent,
		PremierProgramSavedComponent,
		PremierProgramSearchComponent,
		PremiumComponent,
		RateComponent,
		RenewalPopupComponent,
		RepertoireSearchComponent,
		ReplacePipe,
		SaveStripeCardComponent,
		ScholarshipDetailsModalComponent,
		ScholarshipSavedComponent,
		ScholarshipsComponent,
		ScholarshipSearchComponent,
		SchoolProfileComponent,
		SettingsComponent,
		SideBarComponent,
		SigningDayAlertComponent,
		SigningDayAuditionComponent,
		SigningDayComponent,
		SigningDayMusicalTheatreComponent,
		SigningDayPerformanceComponent,
		StripePayComponent,
		TalentProfileComponent,
		UpdateAccountModalComponent,
		VideoPlayerModalComponent,
		ViewedCollagesComponent,

		PublicComponent,
		AboutComponent,
		ArticlesComponent,
		ResourcesComponent,
		AdvantagesComponent,
		WhoComponent,
		WhatComponent,
		WhyComponent,
		HowComponent,
		StudentsComponent,
		TeachersComponent,
		RecruitersComponent,
		OverviewComponent,
		RequirementsComponent,
		ExamComponent,
		FeatureComponent,
		GetConnectedComponent,
		PremierProgramsComponent,
		NonInstitutionalScholarshipsComponent,
		InstitutionalScholarshipsComponent,
		FastTrackComponent,
		AuditionRequirementsComponent,
		SoarComponent,
		TeachingMomentsComponent,
		SuccessComponent,
		GradeByGradeGuideComponent,
		ZzzComponent,
	],
	providers: [
		CatalogService,
		CollegeService,
		DataService,
		GoogleAnalyticsEventsService,
		httpInterceptProviders,
		InviteService,
		LetterService,
		LocationService,
		MessagesService,
		PaymentService,
		PremierProgramService,
		ScholarshipService,
		SchoolService,
		UserService,
	],
	exports: [
		AccountComponent,
		AddCompositionInformationComponent,
		AddMusicalTermComponent,
		BillingComponent,
		CollegeDetailsModalComponent,
		CollegeSavedComponent,
		CollegesComponent,
		CollegeSearchComponent,
		DanceComponent,
		DeleteConversationModalComponent,
		DisableDoubleClickDirective,
		EnterConversationModalComponent,
		FieldErrorDisplayComponent,
		FooterComponent,
		HeaderComponent,
		HomeComponent,
		InviteActionComponent,
		InviteComponent,
		InviteModalComponent,
		JudgeModalComponent,
		JudgeNSDComponent,
		JudgeNsdGeneralComponent,
		JudgeNsdKeyboardComponent,
		JudgeNsdMusicalTheaterComponent,
		JudgeNsdVoiceComponent,
		JudgeNsdWindStringComponent,
		MessagesComponent,
		MusicHistoryGuidsComponent,
		NgbdSortableHeader,
		PaymentComponent,
		PremierProgramDetailsModalComponent,
		PremierProgramSavedComponent,
		PremierProgramSearchComponent,
		PremiumComponent,
		RateComponent,
		RenewalPopupComponent,
		ScholarshipDetailsModalComponent,
		ScholarshipSavedComponent,
		ScholarshipsComponent,
		ScholarshipSearchComponent,
		SideBarComponent,
		SigningDayAlertComponent,
		SigningDayAuditionComponent,
		SigningDayMusicalTheatreComponent,
		SigningDayPerformanceComponent,
		VideoPlayerModalComponent,
		ViewedCollagesComponent,
		
		PublicComponent,
		AboutComponent,
		ArticlesComponent,
		ResourcesComponent,
		AdvantagesComponent,
		WhoComponent,
		WhatComponent,
		WhyComponent,
		HowComponent,
		StudentsComponent,
		TeachersComponent,
		RecruitersComponent,
		OverviewComponent,
		RequirementsComponent,
		ExamComponent,
		FeatureComponent,
		GetConnectedComponent,
		PremierProgramsComponent,
		NonInstitutionalScholarshipsComponent,
		InstitutionalScholarshipsComponent,
		FastTrackComponent,
		AuditionRequirementsComponent,
		SoarComponent,
		TeachingMomentsComponent,
		SuccessComponent,
		GradeByGradeGuideComponent,
		ZzzComponent,
	],
	entryComponents: [
		AddCompositionInformationComponent,
		CollegeDetailsModalComponent,
		DeleteConversationModalComponent,
		EditUserInfoModalComponent,
		EditContactInfoComponent,
		EditDemographicInfoComponent,
		EditPersonalInfoComponent,
		ChangePasswordModalComponent,
		EnterConversationModalComponent,
		EulaModalComponent,
		InviteModalComponent,
		JudgeModalComponent,
		JudgeNSDComponent,
		JudgeNsdGeneralComponent,
		JudgeNsdKeyboardComponent,
		JudgeNsdMusicalTheaterComponent,
		JudgeNsdVoiceComponent,
		JudgeNsdWindStringComponent,
		MusicHistoryGuidsComponent,
		ParentWizardComponent,
		AddNewSchoolComponent,
		RenewalPopupComponent,
		SaveStripeCardComponent,
		ScholarshipDetailsModalComponent,
		SigningDayAlertComponent,
		SigningDayAuditionComponent,
		SigningDayMusicalTheatreComponent,
		SigningDayPerformanceComponent,
		StripePayComponent,
		UpdateAccountModalComponent,
		VideoPlayerModalComponent,
	]
})

export class SharedModule { }

// To be used in routes of app module
export {
	AccountComponent,
	AddCompositionInformationComponent,
	AddMusicalTermComponent,
	BillingComponent,
	CampsSearchComponent,
	CatalogService,
	CollegePreferenceService,
	CollegesComponent,
	CollegeSearchComponent,
	CollegeService,
	CustomValidators,
	DanceComponent,
	DataService,
	DeleteConversationModalComponent,
	DisableDoubleClickDirective,
	EnterConversationModalComponent,
	GoogleAnalyticsEventsService,
	HomeComponent,
	InviteActionComponent,
	InviteComponent,
	InviteModalComponent,
	InviteModel,
	InviteService,
	LocationService,
	MessagesComponent,
	MessagesService,
	MusicalTermsComponent,
	MusicHistoryGuidsComponent,
	NgbdSortableHeader,
	PageNotFoundComponent,
	PaymentComponent,
	PaymentService,
	PremierProgramSearchComponent,
	PremierProgramService,
	PremiumComponent,
	RateComponent,
	RepertoireSearchComponent,
	ScholarshipsComponent,
	ScholarshipSearchComponent,
	ScholarshipService,
	SchoolService,
	SettingsComponent,
	SortEvent,
	StateModel,
	StripePayComponent,
	UserModel,
	UserService,
	ValidateEmailNotTaken,
	VideoPlayerModalComponent,
	ViewedCollagesComponent,

	PublicComponent,
	AboutComponent,
	ArticlesComponent,
	ResourcesComponent,
	AdvantagesComponent,
	WhoComponent,
	WhatComponent,
	WhyComponent,
	HowComponent,
	StudentsComponent,
	TeachersComponent,
	RecruitersComponent,
	OverviewComponent,
	RequirementsComponent,
	ExamComponent,
	FeatureComponent,
	GetConnectedComponent,
	PremierProgramsComponent,
	NonInstitutionalScholarshipsComponent,
	InstitutionalScholarshipsComponent,
	FastTrackComponent,
	AuditionRequirementsComponent,
	SoarComponent,
	TeachingMomentsComponent,
	SuccessComponent,
	GradeByGradeGuideComponent,
	ZzzComponent,
};