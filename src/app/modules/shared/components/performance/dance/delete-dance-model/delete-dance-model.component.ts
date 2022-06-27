import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DanceService } from '../../../../../student/services/dance.service';
import { DanceModel } from '../../../../../student/models/dance.model';
import { UserModel } from '../../../../../shared/models/user.model';

@Component({
	selector: 'app-delete-dance-model',
	templateUrl: './delete-dance-model.component.html',
})

export class DeleteDanceModelComponent {

	@Input() student_id: string;
	@Input() danceid: string;

	student = new UserModel({});
	model = new DanceModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private danceService: DanceService,
		public activeModal: NgbActiveModal
	) { }

	delete() {

		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.danceService.deleteStudentDance(this.student_id, this.danceid).subscribe(
			(response: any) => {
				this.feedback = 'Dance information deleted';
				this.requestSuccess = true;
				this.loading = false;
				setTimeout(() => {
					this.activeModal.close(response.data);
				}, 2000);
			},
			err => {
				console.error(
					'SA.student.student.component - remove dance item',
					err
				);
				this.feedback = 'Unable to delete dance information';
				this.requestFailed = true;
				this.loading = false;
			}
		);

	}

	close() {

		this.activeModal.dismiss('Cross click');

	}

}