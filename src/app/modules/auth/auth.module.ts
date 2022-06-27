import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './register/welcome/welcome.component';
import { ActivateComponent } from './activate/activate.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { AuthGuard } from './auth.guard';
import { PersonalInfoComponent } from './register/wizard/personal-info/personal-info.component';
import { AccountInfoComponent } from './register/wizard/account-info/account-info.component';
import { LocationInfoComponent } from './register/wizard/location-info/location-info.component';
import { TalentInfoComponent } from './register/wizard/talent-info/talent-info.component';
import { SchoolInfoComponent } from './register/wizard/school-info/school-info.component';
import { ParentInfoComponent } from './register/wizard/parent-info/parent-info.component';
import { CouponCodeComponent } from './register/wizard/coupon-code/coupon-code.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		AuthRoutingModule,
		NgbModule.forRoot(),
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule
	],
	declarations: [
		LoginComponent,
		RegisterComponent,
		WelcomeComponent,
		ActivateComponent,
		RecoverPasswordComponent,
		ResetPasswordComponent,
		PersonalInfoComponent,
		AccountInfoComponent,
		LocationInfoComponent,
		TalentInfoComponent,
		SchoolInfoComponent,
		ParentInfoComponent,
		CouponCodeComponent,
		ProgressBarComponent,
	],
	providers: [
		AuthGuard
	]
})
export class AuthModule { }
