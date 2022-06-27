import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
	selector: 'app-feature',
	templateUrl: './feature.component.html',
	styleUrls: ['./public.component.css']
})

export class FeatureComponent implements OnInit  {

	featureType: string = 'school';

	constructor(
		private activatedRoute: ActivatedRoute,
	) { }
	
	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
					if (params.type) {
						this.featureType = params['type'];
					}
				}
			);
	}

}