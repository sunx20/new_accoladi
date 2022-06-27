import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-audition-requirements',
	templateUrl: './audition-requirements.component.html',
	styleUrls: ['./public.component.css']
})

export class AuditionRequirementsComponent implements OnInit {

	auditionTitle: string;
	auditionPath: string;
	htmlData: any = '';
	htmlString: any = '';

	constructor(
		public http: HttpClient,
		private activatedRoute: ActivatedRoute,
		private sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
					if (params.auditionTitle) {
						this.auditionTitle = params['auditionTitle'];
						this.auditionPath = environment.uiUrl + '/auditions/' + this.auditionTitle + '.html';

						console.log([this.auditionTitle,this.auditionPath]);

						const headers = new HttpHeaders({
							'Content-Type': 'text/plain',
							responseType: 'text'
						});
						headers: new HttpHeaders({
							'Content-Type': 'text/plain',
							Accept: 'text/plain'
						}),
						this.http
							.get(
								this.auditionPath, { responseType: 'text' }
							)
							.subscribe(res => {
								this.htmlString = res;
								this.htmlData = this.sanitizer.bypassSecurityTrustHtml(
													this.htmlString
												);
							});
					} else {
						this.htmlData = '';
					}
				}
			);
	}

}