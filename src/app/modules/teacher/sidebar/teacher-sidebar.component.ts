import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { UserService } from '../../shared/shared.module';

@Component({
	selector: 'app-teacher-sidebar',
	templateUrl: './teacher-sidebar.component.html'
})

export class TeacherSidebarComponent implements OnInit  {

	isSidebarOpen = false;
	currentPath = '';
	currentUrl = '';

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
					this.currentPath = '';
					
					if (event.url.includes('account')) {
						this.currentPath = 'account';
					}

					if (event.url.includes('dashboard')) {
						this.currentPath = 'dashboard';
					}

					if (event.url.includes('students')) {
						this.currentPath = 'students';
					}

					if ( event.url.includes('resources') ) {
						this.currentPath = 'resources';
					}

					if (event.url.includes('search')) {
						this.currentPath = 'search';
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

	showHomeTour() {
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