import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {ListService} from '../../../student/services/list.service';

@Component({
	selector: 'app-view-criteria-modal',
	templateUrl: './view-criteria-modal.component.html'
})

export class ViewCriteriaModalComponent implements OnInit {

	@Input() saved_search: any;

	compositions: string;
	majors: string;
	ensembles: string;
	military: string;
	family: string;
	instrument: string;
	state: string;
	school_grade: string;
	honors_performances: string;
	events: string[];

	constructor(
		public activeModal: NgbActiveModal,
		private listService:ListService
	) {
	 
		this.events = [];
	}

	ngOnInit() {
		this.listService
			.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.events = response.data;
				},
				err => {
					console.error('Recruiter - view-criteria-modal.component - getEvents', err);
				}
			);

		this.updateFields();
	}

	updateFields() {
		if (this.saved_search) {
			const form_criteria = JSON.parse(this.saved_search.form_criteria);

			if (form_criteria.composition1) {
				this.compositions = form_criteria.composition1.title;
				if (
					form_criteria.composition2 &&
					form_criteria.composition2opt
				) {
					this.compositions +=
						' ' +
						form_criteria.composition2opt +
						' ' +
						form_criteria.composition2.title;
					if (
						form_criteria.composition3 &&
						form_criteria.composition3opt
					) {
						this.compositions +=
							' ' +
							form_criteria.composition3opt +
							' ' +
							form_criteria.composition3.title;
					}
				}
			}

			if (form_criteria.major1) {
				this.majors = form_criteria.major1;
				if (form_criteria.major2 && form_criteria.major2opt) {
					this.majors +=
						' ' +
						form_criteria.major2opt +
						' ' +
						form_criteria.major2;
					if (form_criteria.major3 && form_criteria.major3opt) {
						this.majors +=
							' ' +
							form_criteria.major3opt +
							' ' +
							form_criteria.major3;
					}
				}
			}

			if (form_criteria.ensemble1) {
				this.ensembles = form_criteria.ensemble1;
				if (form_criteria.ensemble2 && form_criteria.ensemble2opt) {
					this.ensembles +=
						' ' +
						form_criteria.ensemble2opt +
						' ' +
						form_criteria.ensemble2;
					if (form_criteria.ensemble3 && form_criteria.ensemble3opt) {
						this.ensembles +=
							' ' +
							form_criteria.ensemble3opt +
							' ' +
							form_criteria.ensemble3;
					}
				}
			}

			if (form_criteria.military1) {
				this.military = form_criteria.military1;
				if (form_criteria.military2 && form_criteria.military2opt) {
					this.military +=
						' ' +
						form_criteria.military2opt +
						' ' +
						form_criteria.military2;
					if (form_criteria.military3 && form_criteria.military3opt) {
						this.military +=
							' ' +
							form_criteria.military3opt +
							' ' +
							form_criteria.military3;
					}
				}
			}

			this.family = form_criteria.family ? form_criteria.family : '';
			this.instrument = form_criteria.talent ? form_criteria.talent : '';
			this.state = form_criteria.state ? form_criteria.state : '';
			this.school_grade = form_criteria.school_grade ? form_criteria.school_grade : '';

			this.honors_performances = form_criteria.events.map((item, index) => {
				if (item) {
					return this.events[index];
				} else {
					return '';
				}
			}).filter(i => i).join(', ');
		}
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
