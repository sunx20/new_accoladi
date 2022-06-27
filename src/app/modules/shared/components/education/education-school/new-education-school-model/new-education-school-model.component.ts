import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SchoolModel } from '../../../../models/school.model';
import { SchoolService, LocationService } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-new-education-school-model',
	templateUrl: './new-education-school-model.component.html',
	styleUrls: ['./new-education-school-model.component.css']
})

export class NewEducationSchoolModelComponent implements OnInit {

	@Input() state: string;

	school = new SchoolModel({});
	schoolForm: FormGroup;
	locales = ['Rural:Distant', 'Rural:Fringe', 'Rural:Remote', 'Suburb:Large', 'Urban'];
	states: any[];
	loading = false;

	constructor(
		private activeModal: NgbActiveModal, 
		private schoolService: SchoolService, 
		private locationService: LocationService
	) {
		this.states = this.locationService.getStates();
		this.schoolForm = new FormGroup({
			school: new FormControl( '', [Validators.required] ),
			locale: new FormControl( '' ),
			city: new FormControl( '', [Validators.required] ),
			state: new FormControl( '', [Validators.required] ),
			street: new FormControl( '' ),
			zip: new FormControl( '' ),
			phone: new FormControl( '', [Validators.pattern(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)] )
		});
	}

	ngOnInit() {
		this.schoolForm.get('state').setValue(this.state);
	}

	close() {
		this.activeModal.close();
	}

	updateSchool(composition) {
		let school: SchoolModel = {
			name: composition.school,
			locale: composition.locale,
			address: {
				city: composition.city,
				state: composition.state,
				zip: composition.zip,
				street: composition.street,
			},
			phone: composition.phone
		};

		this.schoolService
			.createNewSchool(
				school
			)
			.subscribe(
				(response: any) => {
					setTimeout(() => {
						let schoolInfo = response.data;
						this.activeModal.close(schoolInfo);
					}, 2000);
				},
				err => {
				}
			);
	}

}
