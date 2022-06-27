import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PrivateStudyService } from '../../../../../student/services/private-study.service';
import { PrivateStudyModel } from '../../../../../student/models/private-study.model';
import { UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-delete-private-study-modal',
	templateUrl: './delete-private-study-modal.component.html'
})

export class DeletePrivateStudyModalComponent {

	@Input() student_id: string;
	@Input() psid: string;

	student = new UserModel({});
	model = new PrivateStudyModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private psService: PrivateStudyService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.psService
			.deleteStudentPrivateStudy(this.student_id, this.psid)
			.subscribe(
				(response: any) => {
					this.feedback = 'Private study information deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error(
						'SA.student.student.component - remove private-study item',
						err
					);
					this.feedback =
						'Unable to delete private study information';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
}
