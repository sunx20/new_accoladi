import { Component, OnInit } from '@angular/core';

import { UserModel } from '../../../../shared/shared.module';
import { StudentService } from '../../../../student/services/student.service';

@Component({
	selector: 'app-student-wrapper-profile',
	templateUrl: './student-wrapper.component.html'
})

export class StudentWrapperComponent implements OnInit {

	student: UserModel = null;

	constructor(
		private studentService: StudentService
	) { 

	}

	ngOnInit() {
		this.studentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
				this.student = response.data;
			}
		);
	}
	
}
