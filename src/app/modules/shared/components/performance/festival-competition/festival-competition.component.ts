import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FestivalCompetitionService } from '../../../../student/services/festival-competition.service';
import { UserService } from '../../../../shared/shared.module';

import { FestivalCompetitionModel } from '../../../../student/models/festival-competition.model';

import { VideoPlayerModalComponent, UserModel } from '../../../../shared/shared.module';

import { AddFCModalComponent } from './add-festival-competition-modal/add-festival-competition-modal.component';
import { UpdateFCModalComponent } from './update-festival-competition-modal/update-festival-competition-modal.component';
import { DeleteFCModalComponent } from './delete-festival-competition-modal/delete-festival-competition-modal.component';

@Component({
	selector: 'app-festival-competition',
	templateUrl: './festival-competition.component.html'
})

export class FestivalCompetitionComponent implements OnInit {

	@Input() student: UserModel;
	
	festivals_competitions: FestivalCompetitionModel[] = [];
	studentId: string;
	userType: string;

	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private festivalCompetitionService: FestivalCompetitionService
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
			this.festivalCompetitionService.getAllStudentFCs(this.userService.currentUser._id).subscribe((response: any) => {
				this.festivals_competitions = response.data.festivals_competitions;
			});
		} else {
			this.studentId = this.student._id;
			this.festivals_competitions = this.student.festivals_competitions;
		}
	}

	addStudentFC() {
		let modalRef = this.modalService.open(AddFCModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.festivals_competitions = user.festivals_competitions;
			},
			reason => { }
		);
	}

	updateStudentFC(fcid: string) {
		let modalRef = this.modalService.open(UpdateFCModalComponent, {
			size: 'lg'
		});
		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.fcid = fcid;

		modalRef.result.then(
			user => {
				this.festivals_competitions = user.festivals_competitions;
			},
			reason => { }
		);
	}

	removeStudentFC(fcid: string) {
		let modalRef = this.modalService.open(DeleteFCModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.fcid = fcid;

		modalRef.result.then(
			user => {
				this.festivals_competitions = user.festivals_competitions;
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
