import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TalentService } from '../../../../../student/services/talent.service';

import { UserModel } from '../../../../../shared/shared.module';
import { TalentModel } from '../../../../../student/models/talent.model';

@Component({
	selector: 'app-delete-talent-modal',
	templateUrl: './delete-talent-modal.component.html'
})

export class DeleteTalentModalComponent {

	@Input() student_id: string;
	@Input() talent_id: string;

	student = new UserModel({});
	model = new TalentModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private stService: TalentService,
		public activeModal: NgbActiveModal,
	) {

	}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.stService
			.deleteStudentTalent(
				this.student_id, 
				this.talent_id
			)
			.subscribe(
				(response: any) => {
					this.feedback = 'Talent information deleted';
					this.requestSuccess = true;
					
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error('SA.student.student.component - remove talent item', err);
					this.feedback = 'Unable to delete talent information';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}
