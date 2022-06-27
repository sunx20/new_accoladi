import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { GoogleAnalyticsEventsService } from './modules/shared/shared.module';
import { environment } from '../environments/environment';

declare let ga: Function;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {

	label = environment.label;
	title = environment.title;
	copywrite = environment.copywrite;
	build = environment.build;

	constructor(
		public router: Router,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.router
			.events
			.subscribe(
				event => {
					if (event instanceof NavigationEnd) {
						ga('set', 'page', event.urlAfterRedirects);
						ga('send', 'pageview');
					}
				}
			);
		console.log({title:this.title,label:this.label,copy:this.copywrite,build:this.build});
	}

}