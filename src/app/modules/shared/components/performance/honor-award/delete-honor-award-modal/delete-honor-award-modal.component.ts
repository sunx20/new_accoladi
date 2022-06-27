import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HonorAwardService } from '../../../../../student/services/honor-award.service';
import { HonorAwardModel } from '../../../../../student/models/honor-award.model';
import { UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-delete-honor-award-modal',
	templateUrl: './delete-honor-award-modal.component.html'
})

export class DeleteHonorAwardModalComponent {

	@Input() student_id: string;
	@Input() haid: string;

	student = new UserModel({});
	model = new HonorAwardModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private haService: HonorAwardService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.haService.deleteStudentHA(this.student_id, this.haid).subscribe(
			(response: any) => {
				this.feedback = 'Honors and Awards information deleted';
				this.requestSuccess = true;
				this.loading = false;
				setTimeout(() => {
					this.activeModal.close(response.data);
				}, 2000);
			},
			err => {
				console.error(
					'SA.student.student.component - remove honor-award item',
					err
				);
				this.feedback =
					'Unable to delete honors and awards information';
				this.requestFailed = true;
				this.loading = false;
			}
		);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
}
