import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddPrivateStudyModalComponent } from './add-private-study-modal/add-private-study-modal.component';
import { UpdatePrivateStudyModalComponent } from './update-private-study-modal/update-private-study-modal.component';
import { DeletePrivateStudyModalComponent } from './delete-private-study-modal/delete-private-study-modal.component';

import { VideoPlayerModalComponent, UserModel } from '../../../../shared/shared.module';
import { UserService } from '../../../../shared/shared.module';
import { PrivateStudyService } from '../../../../student/services/private-study.service';
import { PrivateStudyModel } from '../../../../student/models/private-study.model';

@Component({
	selector: 'app-private-study',
	templateUrl: './private-study.component.html'
})

export class PrivateStudyComponent implements OnInit {

	@Input() student: UserModel;
	studentId: string;
	private_studies: PrivateStudyModel[] = [];
	userType: string;

	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private privateStudyService: PrivateStudyService
	) {
		if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		} else if (this.userService.currentUser.role == 'Student') {
			this.userType = 'student'
		}
	}

	ngOnInit() {
		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.privateStudyService.getAllStudentPrivateStudies(this.userService.currentUser._id).subscribe((response: any) => {
				this.private_studies = response.data.private_studies;
			});
		} else {
			this.studentId = this.student._id;
			this.private_studies = this.student.private_studies;
		}
	}

	addStudentPrivateStudy() {
		const modalRef = this.modalService.open(AddPrivateStudyModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result.then(
			user => {
				this.private_studies = user.private_studies;
			},
			reason => { }
		);
	}

	updateStudentPrivateStudy(psid: string) {
		const modalRef = this.modalService.open(UpdatePrivateStudyModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.psid = psid;
		modalRef.result.then(
			user => {
				this.private_studies = user.private_studies;
			},
			reason => { }
		);
	}

	removeStudentPrivateStudy(psid: string) {
		const modalRef = this.modalService.open(DeletePrivateStudyModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.psid = psid;
		modalRef.result.then(
			user => {
				this.private_studies = user.private_studies;
			},
			reason => { }
		);
	}

	playVideo(video: string) {
		const modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.video = video;
	}
}
