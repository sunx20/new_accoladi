import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddESModalComponent } from './add-education-school-modal/add-education-school-modal.component';
import { UpdateESModalComponent } from './update-education-school-modal/update-education-school-modal.component';
import { DeleteESModalComponent } from './delete-education-school-modal/delete-education-school-modal.component';
import { UserModel, UserService } from '../../../../shared/shared.module';
import { EducationSchoolService } from '../../../../student/services/education-school.service';

@Component({
	selector: 'app-education-school',
	templateUrl: './education-school.component.html'
})

export class EducationSchoolComponent {

	@Input() student: UserModel;

	education: any;
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private educationSchoolService: EducationSchoolService
	) {
		if ( this.userService.currentUser.role == 'Student') {
			this.userType = 'student'
		} else if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		}
	}

	ngOnInit() {
		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.educationSchoolService
				.getAllStudentESs(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.education = response.data.education;
					}
				);
		} else {
			this.studentId = this.student._id;
			this.education = this.student.education;
		}
	}

	addStudentES() {
		let modalRef = this.modalService.open(AddESModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.education = user.education;
					},
					reason => { }
				);
	}

	updateStudentES(esid: string) {
		let modalRef = this.modalService.open(UpdateESModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.esid = esid;
		modalRef.result
				.then(
				user => {
					this.education = user.education;
				},
				reason => { }
			);
	}

	removeStudentES(esid: string) {
		let modalRef = this.modalService.open(DeleteESModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.esid = esid;
		modalRef.result
				.then(
					user => {
						this.education = user.education;
					},
					reason => { }
				);
	}
	
}
