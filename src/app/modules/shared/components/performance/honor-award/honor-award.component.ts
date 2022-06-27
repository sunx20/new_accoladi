import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HonorAwardService } from '../../../../student/services/honor-award.service';
import { UserService } from '../../../../shared/shared.module';

import { HonorAwardModel } from '../../../../student/models/honor-award.model';

import { VideoPlayerModalComponent, UserModel } from '../../../../../modules/shared/shared.module';

import { AddHonorAwardModalComponent } from './add-honor-award-modal/add-honor-award-modal.component';
import { UpdateHonorAwardModalComponent } from './update-honor-award-modal/update-honor-award-modal.component';
import { DeleteHonorAwardModalComponent } from './delete-honor-award-modal/delete-honor-award-modal.component';

@Component({
	selector: 'app-honor-award',
	templateUrl: './honor-award.component.html'
})

export class HonorAwardComponent implements OnInit {

	@Input() student: UserModel;

	honors_awards: HonorAwardModel[] = [];
	studentId: string;
	userType:string;

	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private honorAwardService: HonorAwardService
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
			this.honorAwardService
				.getAllStudentHAs(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
					this.honors_awards = response.data.honors_awards;
				}
			);
		} else {
			this.studentId = this.student._id;
			this.honors_awards = this.student.honors_awards;
		}
	}

	addStudentHA() {
		let modalRef = this.modalService.open(AddHonorAwardModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.honors_awards = user.honors_awards;
			},
			reason => { }
		);
	}

	updateStudentHA(haid: string) {
		let modalRef = this.modalService.open(UpdateHonorAwardModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.haid = haid;

		modalRef.result.then(
			user => {
				this.honors_awards = user.honors_awards;
			},
			reason => { }
		);
	}

	removeStudentHA(haid: string) {
		let modalRef = this.modalService.open(DeleteHonorAwardModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.haid = haid;

		modalRef.result.then(
			user => {
				this.honors_awards = user.honors_awards;
			},
			reason => { }
		);
	}

	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.video = video;
	}

}