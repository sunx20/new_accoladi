import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-articles',
	templateUrl: './articles.component.html',
	styleUrls: ['./public.component.css']
})

export class ArticlesComponent implements OnInit  {

	articleTitle: string;
	articlePath: string;
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
					if (params.articleTitle) {
						this.articleTitle = params['articleTitle'];
						this.articlePath = environment.uiUrl + '/articles/' + this.articleTitle + '.html';

						const headers = new HttpHeaders({
							'Content-Type': 'text/plain',
							responseType: 'text'
						});
						headers: new HttpHeaders({
							'Content-Type': 'text/plain',
							Accept: 'text/plain'
						}),
						this.http
							.get(this.articlePath, { responseType: 'text' })
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