import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../../modules/shared/shared.module';
import { StudentModel } from '../../models/student.model';
import { TeacherService } from '../../services/teacher.service';

@Component({
	selector: 'app-delete-student-modal',
	templateUrl: './delete-student-modal.component.html'
})

export class DeleteStudentTModalComponent {

	@Input() teacher_id: string;
	@Input() student_id: string;

	teacher = new UserModel({});
	model = new StudentModel({});

	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private teacherService: TeacherService,
		public activeModal: NgbActiveModal,
	) {

	}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.teacherService
			.deleteStudent(
				this.teacher_id, 
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
					console.error('SA.teacher.teacher.component - remove student', err);
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