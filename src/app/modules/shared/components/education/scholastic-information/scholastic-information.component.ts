import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdateSIModalComponent } from './update-scholastic-information-modal/update-scholastic-information-modal.component';
import { UserModel, UserService } from '../../../../shared/shared.module';
import { ScholasticInformationService } from '../../../../student/services/scholastic-information.service';
import { ScholasticModel } from '../../../../student/models/scholastic.model';

@Component({
	selector: 'app-scholastic-information',
	templateUrl: './scholastic-information.component.html'
})

export class ScholasticInformationComponent {

	@Input() student: UserModel;

	scholastic_info = 0;
	scholastics: ScholasticModel;
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private scholasticInformationService: ScholasticInformationService
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
			this.scholasticInformationService
				.getAllStudentSIs(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.scholastics = response.data.scholastics;
						this.countMetrics();
					}
				);
		} else {
			this.studentId = this.student._id;
			this.scholastics = this.student.scholastics;
		}
		this.countMetrics();
	}

	countMetrics() {
		if (this.student && this.student.scholastics) {
			this.scholastic_info = 0;
			if (this.student.scholastics.gpa) this.scholastic_info++;
			if (this.student.scholastics.sat) this.scholastic_info++;
			if (this.student.scholastics.act) this.scholastic_info++;
		}
	}

	updateStudentSI() {
		let modalRef = this.modalService
							.open(
								UpdateSIModalComponent
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.scholastics = user.scholastics;
						this.countMetrics();
					},
					reason => { }
				);
	}

}