import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './register/welcome/welcome.component';
import { ActivateComponent } from './activate/activate.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'register/promo/:promo',
		component: RegisterComponent
	},
	{
		path: 'register/:role',
		component: RegisterComponent
	},
	{
		path: 'register/:role/promo/:promo',
		component: RegisterComponent
	},
	{
		path: 'welcome',
		component: WelcomeComponent
	},
	{
		path: 'welcome/:role',
		component: WelcomeComponent
	},
	{
		path: 'activate/:key',
		component: ActivateComponent
	},
	{
		path: 'recover-password',
		component: RecoverPasswordComponent
	},
	{
		path: 'reset-password/:key',
		component: ResetPasswordComponent
	}
]

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})

export class AuthRoutingModule { }
