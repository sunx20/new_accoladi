	import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdateStudentAccountModalComponent } from './update-student-account-modal/update-student-account-modal.component';
import { UserModel, UserService } from '../../../../shared/shared.module';
import { StudentService } from '../../../../student/services/student.service';

@Component({
	selector: 'app-student-account',
	templateUrl: './student-account.component.html'
})

export class StudentAccountComponent implements OnInit {

	student: UserModel;
	dob = '';
	months: string[];
	role:string;
	
	constructor(
		private modalService: NgbModal,
		private studentService: StudentService,
		private userService: UserService
	) {
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
	}

	ngOnInit() {
		setTimeout(() => {
			if (!this.addressProvided(this.student.address)) {
				this.updateStudentAI('Please fill in address information');
			}
		}, 2000);

		this.studentService.getMyProfile().subscribe((response: any) => {
			this.student = response.data;
			this.setDOB();
		});
		this.role=this.userService.currentUser.role

	}

	setDOB() {
		this.dob = '';
		if (this.student && this.student.dob) {
			if (this.student.dob.month) {
				this.dob = this.dob + this.months[this.student.dob.month - 1] + ' ';
			}
			if (this.student.dob.day) {
				this.dob = this.dob + this.student.dob.day + ', ';
			}
			if (this.student.dob.year) {
				this.dob = this.dob + this.student.dob.year;
			}
		}
	}

	addressProvided(address: any) {
		if (!address.city || !address.state || !address.postal_code) {
			return false;
		}
		return true;
	}

	updateStudentAI(msg = '') {
		const modalRef = this.modalService.open(UpdateStudentAccountModalComponent, { size: 'lg' });
		modalRef.componentInstance.student_id = this.student._id;
		modalRef.componentInstance.msg = msg;
		modalRef.result.then((user) => {
			this.studentService.getMyProfile().subscribe((response: any) => {
				this.student = response.data;
				this.setDOB();
			});
		}, (reason) => {
		});
	}


}
