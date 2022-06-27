import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { UserModel } from '../../shared/shared.module';
import { RecruiterService } from '../services/recruiter.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit {

	@ViewChild('scrollElement') scrollElement: ElementRef;

	recruiter: UserModel;
	response: any;
	total: number;
	page: number;
	pageSize: number;
	isScrolled: boolean = true

	constructor(
		private recruiterService: RecruiterService
	) {
		this.page = 1;
		this.pageSize = 10;
		this.total = 0;
	}

	ngOnInit() {
		this.getMyProfile();
	}

	getMyProfile() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
				}
			);
	}

	onSearch($event) {
		if ($event == '') {
			this.page = 1;
			this.pageSize = 10;
			this.total = 0;
		} this.response = $event;
	}

	onPaginate($event) {
		this.page = $event;
		if (!this.isScrolled) {
			this.scrollElement
				.nativeElement
				.scrollIntoView(
					{ 
						behavior: 'smooth', 
						block: "start" 
					}
				)
			setTimeout(() => {
				window.scrollBy(0, -90)
			}, 500);
		}
		this.isScrolled = !this.isScrolled
	}

	scroll() {
		this.scrollElement
			.nativeElement
			.scrollIntoView(
				{ 
					behavior: 'smooth' 
				}
			)
		setTimeout(() => {
			window.scrollBy(0, 560)
		}, 500);
	}
	
}
