import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SendLetterModalComponent } from './send-letter-modal/send-letter-modal.component';
import { StudentService } from '../../../student/services/student.service';
import { LetterService } from '../../../student/services/letter.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../../shared/shared.module';

@Component({
	selector: 'app-letter',
	templateUrl: './letter.component.html'
})

export class LetterComponent implements OnInit {

	@Input() student: UserModel;
	isStudentLetterCollapsed = false;
	requestLetters: any[];
	referralLetters: any[];
	introductionLetters: any[];
	studentId: any;
	role: any;
	userType: string;

	constructor(
		private modalService: NgbModal,
		private studentService: StudentService,
		private letterService: LetterService,
		private userService: UserService,
	) {
		this.requestLetters = this.referralLetters = this.introductionLetters = [];
	}

	ngOnInit() {
		const userType = this.userService.currentUser.role.toLowerCase();
		if (userType === 'student') {
			this.studentId = this.userService.currentUser._id;
		}
		this.letterService
			.getStudentLetters(this.userService.currentUser._id)
			.subscribe((response: any) => {
				// this.requestLetters = response.data.filter(
				// 	(l: any) => l.type === 'request'
				// );
				// this.referralLetters = response.data.filter(
				// 	(l: any) => l.type === 'referral'
				// );
				// this.introductionLetters = response.data.filter(
				// 	(l: any) => l.type === 'introduction'
				// );
				this.referralLetters = response.data;
			},
			err => {
				console.error('Unable to get student letters', err);
			});
	}

	send() {
		const modalRef = this.modalService.open(SendLetterModalComponent, {
			size: 'lg'
		});

		if ( this.student !== undefined ) {
			modalRef.componentInstance.student_id = this.student._id;
		} else {
			modalRef.componentInstance.student_id = this.studentId;
		}

		modalRef.result.then(
			data => {
				console.log(data);
			},
			reason => { }
		);
	}
}
