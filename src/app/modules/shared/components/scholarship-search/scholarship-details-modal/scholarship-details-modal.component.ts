import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from '../../../services/location.service';
import { ScholarshipService } from '../../../services/scholarship.service';

@Component({
	selector: 'app-scholarship-details-modal',
	templateUrl: './scholarship-details-modal.component.html'
})

export class ScholarshipDetailsModalComponent implements OnInit {

	@Input() scholarship_id: string;

	scholarship: any;
	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
		private locationService: LocationService,
		private scholarshipService: ScholarshipService
	) {
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.scholarshipService
			.getScholarshipById(this.scholarship_id)
			.subscribe((response: any) => {
				this.scholarship = response.data;
			});
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

	extractType(s: any) {
		return s && s.type
			? s.type
				.map(t => {
					switch (t) {
						case 'M':
							return 'Music';
						case 'D':
							return 'Dance';
						case 'T':
							return 'Theater';
						case 'G':
							return 'General';
						default:
					}
				})
				.join(', ')
			: '';
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
