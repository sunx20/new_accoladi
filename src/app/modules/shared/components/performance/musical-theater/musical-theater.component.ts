import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddMusicalTheaterModalComponent } from './add-musical-theater-modal/add-musical-theater-modal.component';
import { UpdateMusicalTheaterModalComponent } from './update-musical-theater-modal/update-musical-theater-modal.component';
import { DeleteMusicalTheaterModalComponent } from './delete-musical-theater-modal/delete-musical-theater-modal.component';
import { VideoPlayerModalComponent, UserModel } from '../../../../shared/shared.module';
import { UserService } from '../../../../shared/shared.module';
import { MusicalTheaterService } from '../../../../student/services/musical-theater.service';
import { MusicalTheaterModel } from '../../../../student/models/musical-theater.model';

@Component({
	selector: 'app-musical-theater',
	templateUrl: './musical-theater.component.html'
})

export class MusicalTheaterComponent implements OnInit {

	@Input() student: UserModel;

	musical_theater: MusicalTheaterModel[] = [];
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private musicalTheaterService: MusicalTheaterService
	) {
		if(this.userService.currentUser.role == 'Student'){
			this.userType = 'student'
		} else if(this.userService.currentUser.role == 'Teacher'){
			this.userType = 'teacher'
		}
	}

	ngOnInit() {
		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.musicalTheaterService.getAllStudentMTs(this.userService.currentUser._id).subscribe((response: any) => {
				this.musical_theater = response.data.musical_theater;
			});
		} else {
			this.studentId = this.student._id;
			this.musical_theater = this.student.musical_theater;
		}
	}

	addStudentMT() {
		let modalRef = this.modalService.open(AddMusicalTheaterModalComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then((user) => {
			this.musical_theater = user.musical_theater;
		}, (reason) => {

		});
	}

	updateStudentMT(mtid: string) {
		let modalRef = this.modalService.open(UpdateMusicalTheaterModalComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mtid = mtid;

		modalRef.result.then((user) => {
			this.musical_theater = user.musical_theater;
		}, (reason) => {

		});
	}

	removeStudentMT(mtid: string) {
		let modalRef = this.modalService.open(DeleteMusicalTheaterModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mtid = mtid;

		modalRef.result.then((user) => {
			this.musical_theater = user.musical_theater;
		}, (reason) => {

		});

	}

	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: "lg"
		});

		modalRef.componentInstance.video = video;
	}

}
