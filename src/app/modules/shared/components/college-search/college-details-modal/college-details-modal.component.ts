import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CollegeService } from '../../../services/college.service';
import { LocationService } from '../../../services/location.service';

@Component({
	selector: 'app-college-details-modal',
	templateUrl: './college-details-modal.component.html'
})

export class CollegeDetailsModalComponent implements OnInit {

	@Input() college_id: string;

	college: any;
	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
		private locationService: LocationService,
		private collegeService: CollegeService
	) {
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.collegeService
			.getCollegeById(
				this.college_id
			)
			.subscribe(
					(response: any) => {
					if (response.data.url! = '') {
						if (response.data.url.indexOf('http://') > -1 || response.data.url.indexOf('https://') > -1 ) {
							//if http:// or https:// exist Do Nothing
						} else {
							response.data.url = 'http://' + response.data.url
						}
					}
					this.college = response.data;
				}
			);
	}

	joinArray(items: string[]) {
		return items;//.join(', ');
	}

	extractState(data: any) {
		if (data) {
			return this.states
						.filter(s => s.abbr === data)
						.map(s => s.name)
						.pop();
		}

		return '';
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}