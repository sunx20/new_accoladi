import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from '../../../services/location.service';
import { PremierProgramService } from '../../../services/premier-program.service';

@Component({
	selector: 'app-premier-program-details-modal',
	templateUrl: './premier-program-details-modal.component.html'
})

export class PremierProgramDetailsModalComponent implements OnInit {

	@Input() premier_program_id: string;

	premier_program: any;
	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
		private locationService: LocationService,
		private premierProgramService: PremierProgramService
	) {
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.premierProgramService
			.getPremierProgramById(this.premier_program_id)
			.subscribe((response: any) => {
				this.premier_program = response.data;
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
