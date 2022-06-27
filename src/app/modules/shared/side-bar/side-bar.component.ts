import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { UserService } from '../services/user.service';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
})

export class SideBarComponent implements OnInit {

	isSidebarOpen = false;
	currentPath = '';
	currentUrl = '';
	profileLink = '';
	sideBarNav: [];

	constructor(
		private router: Router,
		private userService: UserService
	) {
		this.router
			.events
			.filter(
				event => event instanceof NavigationEnd
			)
			.subscribe(
				(event: NavigationEnd) => {
					this.currentUrl = event.url;
					this.currentPath = '';
					if (event.url.includes('profile') || event.url.includes('full-profile')) {
						this.currentPath = 'profile';
					}

					if (event.url.includes('performance')) {
						this.currentPath = 'performance';
					}

					if (event.url.includes('education')) {
						this.currentPath = 'education';
					}

					if (event.url.includes('resources') || event.url.includes('search')) {
						this.currentPath = 'resources';
					}

					if (event.url.includes('search') && (event.url.includes('talent') || event.url.includes('saved'))) {
						this.currentPath = 'search';
					}

					if (event.url.includes('account')) {
						this.currentPath = 'account';
					}

					if (event.url.includes('dashboard')) {
						this.currentPath = 'dashboard';
					}

					if (event.url.includes('students')) {
						this.currentPath = 'students';
					}

					if (event.url.includes('profile/messages')) {
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
		this.sideNavigation();
	}

	showProfileTour() {
		if (this.userService.currentUser.role == 'Student') {
			localStorage.removeItem('studentProfileTour');

			if (!this.currentUrl.includes('/student/profile')) {
				this.router.navigate(['/student/profile']);
			} else {
				this.router.navigate(['/student/profile'], {
					queryParams: { tour: true, ref: Math.random() }
				});
			}
		} else if (this.userService.currentUser.role == 'Teacher') {
			localStorage.removeItem('teacherProfileTour');

			if (!this.currentUrl.includes('/teacher/profile')) {
				this.router.navigate(['/teacher/profile']);
			} else {
				this.router.navigate(['/teacher/profile'], {
					queryParams: { tour: true, ref: Math.random() }
				});
			}
		}

	}

	showHomeTour() {
		if (this.userService.currentUser.role == 'Student') {
			localStorage.removeItem('studentHomeTour');

			if (!this.currentUrl.includes('/student/home')) {
				this.router.navigate(['/student/home']);
			} else {
				this.router.navigate(['/student/home'], {
					queryParams: { tour: true, ref: Math.random() }
				});
			}
		} else if (this.userService.currentUser.role == 'Teacher') {
			localStorage.removeItem('teacherHomeTour');

			if (!this.currentUrl.includes('/teacher/home')) {
				this.router.navigate(['/teacher/home']);
			} else {
				this.router.navigate(['/teacher/home'], {
					queryParams: { tour: true, ref: Math.random() }
				});
			}
		}

	}

	sideNavigation() {
		this.userService
			.sideNavigation(
				this.userService.currentUser._id, 
				this.userService.currentUser.role
			)
			.subscribe(
				(response: any) => {
					this.sideBarNav = response.data;
				}
			);
	}

}