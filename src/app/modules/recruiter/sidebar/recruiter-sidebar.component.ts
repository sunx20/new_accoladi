import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { UserService } from '../../shared/shared.module';

@Component({
	selector: 'app-recruiter-sidebar',
	templateUrl: './recruiter-sidebar.component.html'
})

export class RecruiterSidebarComponent implements OnInit {

	isSidebarOpen = false;
	currentPath = '';

	constructor(
		private router: Router,
		private userService: UserService
	) {
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe((event: NavigationEnd) => {
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

			});
	}

	ngOnInit() {
		this.userService.sidebarSubject.subscribe((response: string) => {
			this.isSidebarOpen = response === 'true';
		});
	}

}
