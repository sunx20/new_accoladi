import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MusicalTheaterService } from '../../../../../student/services/musical-theater.service';
import { MusicalTheaterModel } from '../../../../../student/models/musical-theater.model';
import { UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-delete-musical-theater-modal',
	templateUrl: './delete-musical-theater-modal.component.html'
})

export class DeleteMusicalTheaterModalComponent {

	@Input() student_id: string;
	@Input() mtid: string;

	student = new UserModel({});
	model = new MusicalTheaterModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private mtService: MusicalTheaterService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.mtService.deleteStudentMT(this.student_id, this.mtid).subscribe(
			(response: any) => {
				this.feedback = 'Musical theater information deleted';
				this.requestSuccess = true;
				this.loading = false;
				setTimeout(() => {
					this.activeModal.close(response.data);
				}, 2000);
			},
			err => {
				console.error(
					'SA.student.student.component - remove musical theater item',
					err
				);
				this.feedback = 'Unable to delete musical theater information';
				this.requestFailed = true;
				this.loading = false;
			}
		);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
}
