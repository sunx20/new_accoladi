import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FestivalCompetitionService } from '../../../../../student/services/festival-competition.service';
import { FestivalCompetitionModel } from '../../../../../student/models/festival-competition.model';
import { UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-delete-festival-competition-modal',
	templateUrl: './delete-festival-competition-modal.component.html'
})

export class DeleteFCModalComponent {

	@Input() student_id: string;
	@Input() fcid: string;

	student = new UserModel({});
	model = new FestivalCompetitionModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private fcService: FestivalCompetitionService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.fcService.deleteStudentFC(this.student_id, this.fcid).subscribe(
			(response: any) => {
				this.feedback =
					'Festivals and Competitions information deleted';
				this.requestSuccess = true;
				this.loading = false;
				setTimeout(() => {
					this.activeModal.close(response.data);
				}, 2000);
			},
			err => {
				console.error(
					'SA.student.student.component - remove festival-competition item',
					err
				);
				this.feedback =
					'Unable to delete festivals and competitions information';
				this.requestFailed = true;
				this.loading = false;
			}
		);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
}
