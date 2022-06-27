import { Component, OnInit, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GeneralPerformanceService } from '../../../../student/services/general-performance.service';
import { UserService } from '../../../../shared/shared.module';

import { PerformanceModel } from '../../../../student/models/performance.model';

import { VideoPlayerModalComponent, UserModel } from '../../../../shared/shared.module';

import { AddPerformanceModalComponent } from './add-performance-modal/add-performance-modal.component';
import { UpdatePerformanceModalComponent } from './update-performance-modal/update-performance-modal.component';
import { DeletePerformanceModalComponent } from './delete-performance-modal/delete-performance-modal.component';

@Component({
	selector: 'app-general-performance',
	templateUrl: './general-performance.component.html'
})

export class GeneralPerformanceComponent implements OnInit {

	@Input() student: UserModel;

	performances: PerformanceModel[] = [];
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private generalPerformanceService: GeneralPerformanceService
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
			this.generalPerformanceService
				.getAllStudentPerformances(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.performances = response.data.performances;
					});
		} else {
			this.studentId = this.student._id;
			this.performances = this.student.performances;
		}
	}

	addStudentPerformance() {
		const modalRef = this.modalService.open(AddPerformanceModalComponent, {
			size: 'lg',
			windowClass: 'custom-class'
		});

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.performances = user.performances;
			},
			reason => { }
		);
	}

	updateStudentPerformance(pid: string) {
		const modalRef = this.modalService.open(UpdatePerformanceModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.performance_id = pid;

		modalRef.result.then(
			user => {
				this.performances = user.performances;
			},
			reason => { }
		);
	}

	removeStudentPerformance(pid: string) {
		const modalRef = this.modalService.open(DeletePerformanceModalComponent);
		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.performance_id = pid;

		modalRef.result.then(
			user => {
				this.performances = user.performances;
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
