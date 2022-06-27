import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdateCPModalComponent } from './update-college-preference-modal/update-college-preference-modal.component';
import { UserModel, UserService } from '../../../../shared/shared.module';
import { CollegePreferenceService } from '../../../../student/services/college-preference.service';

@Component({
	selector: 'app-college-preference',
	templateUrl: './college-preference.component.html'
})

export class CollegePreferenceComponent implements OnInit {

	@Input() student: UserModel;

	colleges: any = '';
	majors: any = '';
	ensembles: any = '';
	military: any = '';
	college_pref: any = [];
	studentId: any;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private collegePreferenceService: CollegePreferenceService
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
			this.collegePreferenceService
				.getAllStudentCPs(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.college_pref = response.data.college_pref;
						this.updateColleges();
						this.majors = this.college_pref.majors.join(', ');
						this.ensembles = this.college_pref.ensembles.join(', ');
						this.military = this.college_pref.military.join(', ');
					}
				);
		} else {
			this.studentId = this.student._id;
			this.college_pref = this.student.college_pref;
			this.updateColleges();
			this.majors = this.college_pref.majors.join(', ');
			this.ensembles = this.college_pref.ensembles.join(', ');
			this.military = this.college_pref.military.join(', ');
		}
	}

	updateColleges() {
		if (this.college_pref && this.college_pref.colleges) {
			this.colleges = this.college_pref
								.colleges
								.map(c => c.name)
								.join(', ');
		}
	}

	updateStudentCP() {
		let modalRef = this.modalService
							.open(
								UpdateCPModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result
				.then(
					user => {
						this.college_pref = user.college_pref;
						this.updateColleges();
						this.majors = this.college_pref.majors.join(', ');
						this.ensembles = this.college_pref.ensembles.join(', ');
						this.military = this.college_pref.military.join(', ');
					},
					reason => { }
				);
	}
}
