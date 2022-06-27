import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdateMusicalClassModalComponent } from './update-musical-class-modal/update-musical-class-modal.component';
import { UserModel, UserService } from '../../../../shared/shared.module';
import { MusicalClassService } from '../../../../student/services/musical-class.service';

@Component({
	selector: 'app-musical-class',
	templateUrl: './musical-class.component.html'
})

export class MusicalClassComponent implements OnInit {

	@Input() student: UserModel;

	musical_classes: string[] = [];
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private musicalClassService: MusicalClassService
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
			this.musicalClassService
				.getStudentMCs(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.musical_classes = response.data.musical_classes;
					}
				);
		} else {
			this.studentId = this.student._id;
			this.musical_classes = this.student.musical_classes;
		}
	}

	updateStudentMCs() {
		let modalRef = this.modalService
							.open(
								UpdateMusicalClassModalComponent,
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.musical_classes = user.musical_classes;
					},
					reason => { }
				);
	}

}