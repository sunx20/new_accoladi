import { Component, OnInit } from '@angular/core';

import { UserModel } from '../../../shared/shared.module';
import { StudentService } from '../../../student/services/student.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-student-performance',
	templateUrl: './performance.component.html'
})

export class PerformanceComponent implements OnInit {

	student: UserModel = null;
	userType: string;

	constructor(
		private studentService: StudentService,
		private userService: UserService
	) {
		if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		} else if (this.userService.currentUser.role == 'Student') {
			this.userType = 'student'
		}
	}

	ngOnInit() {
		this.studentService.getMyProfile().subscribe((response: any) => {
			this.student = response.data;
		});
	}
}