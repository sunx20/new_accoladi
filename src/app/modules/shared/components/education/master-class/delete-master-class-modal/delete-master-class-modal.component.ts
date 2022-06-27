import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MasterClassService } from '../../../../../student/services/master-class.service';
import { MasterClassModel } from '../../../../../student/models/master-class.model';
import { UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-delete-master-class-modal',
	templateUrl: './delete-master-class-modal.component.html'
})

export class DeleteMasterClassModalComponent {

	@Input() student_id: string;
	@Input() mcid: string;

	student = new UserModel({});
	model = new MasterClassModel({});

	feedback = '';
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private mcService: MasterClassService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.mcService
			.deleteStudentMC(
				this.student_id, 
				this.mcid
			)
			.subscribe(
				(response: any) => {
					this.feedback = 'Master class information deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error(
						'SA.student.student.component - remove master class item',
						err
					);
					this.feedback = 'Unable to delete master class information';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
