import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdatePSModalComponent } from './update-personal-statement-modal/update-personal-statement-modal.component';

import { UserModel, UserService } from '../../../../shared/shared.module';
import { PersonalStatementService } from '../../../../student/services/personal-statement.service';

@Component({
	selector: 'app-personal-statement',
	templateUrl: './personal-statement.component.html'
})

export class PersonalStatementComponent implements OnInit {

	@Input() student: UserModel;

	personal_statement: string;
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private personalStatementService: PersonalStatementService
	) {
		if (this.userService.currentUser.role == 'Student') {
			this.userType = 'student'
		} else if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		}
	}

	ngOnInit() {
		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.personalStatementService
				.getStudentPS(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.personal_statement = response.data.personal_statement;
					}
				);
		} else {
			this.studentId = this.student._id;
			this.personal_statement = this.student.personal_statement;
		}

	}

	updateStudentPS() {
		let modalRef = this.modalService
							.open(
								UpdatePSModalComponent, 
								{ size: 'lg' }
							);
		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.personal_statement = user.personal_statement;
					},
					reason => { }
				);
	}

}
