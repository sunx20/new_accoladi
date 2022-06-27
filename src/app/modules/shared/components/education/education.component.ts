import { Component, OnInit } from '@angular/core';

import { UserModel } from '../../../shared/shared.module';
import { StudentService } from '../../../student/services/student.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-student-education',
	templateUrl: './education.component.html'
})

export class EducationComponent implements OnInit {

	student: UserModel;
	colleges: any;
	userType: string;

	constructor(
		private studentService: StudentService,
		private userService: UserService
	) {
		if (this.userService.currentUser.role == 'Student') {
			this.userType = 'student'
		} else if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		}
	}

	ngOnInit() {
		if (!this.student) {
			this.studentService
				.getMyProfile()
				.subscribe(
					(response: any) => {
						this.student = response.data;
						this.updateColleges();
					}
				);
		}
	}

	updateColleges() {
		if (this.student && this.student.college_pref.colleges) {
			this.colleges = this.student
								.college_pref
								.colleges
								.slice(0, 5)
								.map(c => c.name)
								.join(', ');
		}
	}

}