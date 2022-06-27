import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../../shared/models/user.model';
import { UserService } from '../../../../shared/services/user.service';

import { AddDanceModelComponent } from './add-dance-model/add-dance-model.component';
import { UpdateDanceModelComponent } from './update-dance-model/update-dance-model.component';
import { DeleteDanceModelComponent } from './delete-dance-model/delete-dance-model.component';
import { DanceService } from '../../../../student/services/dance.service';
import { DanceModel } from '../../../../student/models/dance.model';
import { VideoPlayerModalComponent } from '../../video-player/video-player.component';

@Component({
	selector: 'app-dance',
	templateUrl: './dance.component.html',
})

export class DanceComponent implements OnInit {

	@Input() student: UserModel;

	dance: DanceModel[] = [];
	studentId: string;

	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private danceService: DanceService
	) { }

	ngOnInit() {

		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.danceService.getAllStudentDance(this.userService.currentUser._id).subscribe((response: any) => {
				this.dance = response.data.dance;
			});
		} else {
			this.studentId = this.student._id;
			this.dance = this.student.dance;
		}

	}

	addStudentDance() {
		let modalRef = this.modalService.open(AddDanceModelComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then((user) => {
			this.dance = user.dance;
		}, (reason) => {

		});

	}

	updateStudentDance(danceid: string) {
		let modalRef = this.modalService.open(UpdateDanceModelComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.danceid = danceid;

		modalRef.result.then((user) => {
			this.dance = user.dance;
		}, (reason) => {

		});

	}

	removeStudentDance(danceid: string) {
		let modalRef = this.modalService.open(DeleteDanceModelComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.danceid = danceid;

		modalRef.result.then((user) => {
			this.dance = user.dance;
		}, (reason) => {

		});

	}

	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, { size: "lg" });

		modalRef.componentInstance.video = video;

	}

}
