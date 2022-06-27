import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router
		) {
	}

	canActivate() {
		if (this.authService.isLoggedIn()) {
			console.log('You are logged in...');
			return true;
		} else {
			console.log('Need to log in...');
			this.router.navigate(['/login']);
			return false;
		}
	}

}