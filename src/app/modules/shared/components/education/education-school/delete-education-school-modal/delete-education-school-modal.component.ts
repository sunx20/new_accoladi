import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EducationSchoolService } from "../../../../../student/services/education-school.service";
import { EducationModel } from "../../../../../student/models/education.model";
import { UserModel } from "../../../../../shared/shared.module";

@Component({
	selector: 'app-delete-education-school-modal',
	templateUrl: './delete-education-school-modal.component.html'
})

export class DeleteESModalComponent {

	@Input() student_id: string;
	@Input() esid: string;

	student = new UserModel({});
	model = new EducationModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private esService: EducationSchoolService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.esService
			.deleteStudentES(
				this.student_id, 
				this.esid
			)
			.subscribe(
				(response: any) => {
					this.feedback = 'Education information deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error(
						'SA.education.component - remove education item',
						err
					);
					this.feedback = 'Unable to delete education information';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
