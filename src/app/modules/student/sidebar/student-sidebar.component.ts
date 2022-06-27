import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { UserService } from '../../shared/shared.module';

@Component({
	selector: 'app-student-sidebar',
	templateUrl: './student-sidebar.component.html'
})

export class StudentSidebarComponent implements OnInit {

	isSidebarOpen = false;
	currentPath = '';
	currentUrl = '';
	profileLink = '';

	constructor(
		private router: Router,
		private userService: UserService
	) {
		this.router.events
			.filter(
				event => event instanceof NavigationEnd
			)
			.subscribe(
				(event: NavigationEnd) => {
					this.currentUrl = event.url;
					this.currentPath = '';

					if ( event.url.includes('profile') || event.url.includes('full-profile') ) {
						this.currentPath = 'profile';
					}

					if ( event.url.includes('performance') ) {
						this.currentPath = 'performance';
					}

					if ( event.url.includes('education') ) {
						this.currentPath = 'education';
					}

					if ( event.url.includes('resources') ) {
						this.currentPath = 'resources';
					}

					if ( event.url.includes('search') ) {
						this.currentPath = 'search';
						this.userService.sidebar = 'false';
					}

					if ( event.url.includes('profile/messages' ) ) {
						this.currentPath = 'profile/messages';
						this.userService.sidebar = 'false';
					}

				}
			);
	}

	ngOnInit() {
		this.userService
			.sidebarSubject
			.subscribe(
				(response: string) => {
					this.isSidebarOpen = response === 'true';
				}
			);
	}

	showProfileTour() {
		localStorage.removeItem('studentProfileTour');

		if (!this.currentUrl.includes('/student/profile')) {
			this.router.navigate(['/student/profile']);
		} else {
			this.router.navigate(['/student/profile'], {
				queryParams: { tour: true, ref: Math.random() }
			});
		}
	}

	showHomeTour() {
		localStorage.removeItem('studentHomeTour');

		if (!this.currentUrl.includes('/student/home')) {
			this.router.navigate(['/student/home']);
		} else {
			this.router.navigate(['/student/home'], {
				queryParams: { tour: true, ref: Math.random() }
			});
		}
	}

}