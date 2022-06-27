import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentModel } from '../../../../modules/student/models/student.model';
import { UserModel } from '../../../../modules/shared/shared.module';
import { ParentService } from '../../services/parent.service';

@Component({
	selector: 'app-delete-student-modal',
	templateUrl: './delete-student-modal.component.html'
})

export class DeleteStudentPModalComponent {

	@Input() parent_id: string;
	@Input() student_id: string;

	parent = new UserModel({});
	model = new StudentModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private parentService: ParentService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.parentService
			.deleteStudent(
				this.parent_id, 
				this.student_id
			)
			.subscribe(
				(response: any) => {
					this.feedback = 'Student deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error( 'SA.parent.parent.component - remove student', err );
					this.feedback = 'Unable to delete student';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
