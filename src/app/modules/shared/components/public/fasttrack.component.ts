import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-fasttrack',
	templateUrl: './fasttrack.component.html',
	styleUrls: ['./public.component.css']
})

export class FastTrackComponent implements OnInit  {

	week = 0;

	constructor(
		private activatedRoute: ActivatedRoute,
	) { }

	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
					if (params.week) { console.log(params.week);
						switch ( params.week ) {
							case 'week-1': this.week = 1; break;
							case 'week-2': this.week = 2; break;
							case 'week-3': this.week = 3; break;
							case 'week-4': this.week = 4; break;
							case 'week-5': this.week = 5; break;
							case 'week-6': this.week = 6; break;
							case 'week-7': this.week = 7; break;
							case 'week-8': this.week = 8; break;
							case 'week-9': this.week = 9; break;
							case 'week-10': this.week = 10; break;
							case 'week-11': this.week = 11; break;
							case 'week-12': this.week = 12; break;
							case 'week-13': this.week = 13; break;
							case 'week-14': this.week = 14; break;
							case 'week-15': this.week = 15; break;
							case 'week-16': this.week = 16; break;
							case 'week-17': this.week = 17; break;
							case 'week-18': this.week = 18; break;
							case 'week-19': this.week = 19; break;
							case 'week-20': this.week = 20; break;
							default: this.week = 0;
						 }
					}
				}
			);
	}

}