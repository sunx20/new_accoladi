import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../student/services/student.service';

import { UserModel, VideoPlayerModalComponent } from '../../../../shared/shared.module';

import { ShareModalComponent } from '../../../../recruiter/share/share-modal.component';

@Component({
	selector: 'app-student-full-profile',
	templateUrl: './full-profile.component.html',
	styleUrls: ['./full-profile.component.css']
})

export class FullProfileComponent implements OnInit {

	@Input() student_id: string; 

	student: UserModel;
	age: number;

	public defaultProfileImage = '../../assets/img/avatar.png';
	public profileImage: any = null;

	constructor(
		private modalService: NgbModal,
		private studentService: StudentService
	) {
	}

	ngOnInit() {
		if ( this.student_id ) {
			this.studentService
				.getStudentById(
					this.student_id
				)
				.subscribe(
					(response: any) => {
						this.student = response.data;
						this.profileImage = this.student.profile_imageurl 
											? this.student.profile_imageurl 
											: this.defaultProfileImage;
						
						let tempEducation: any = []
						this.student.education.forEach(element => {
							if (element.current == true) {
								tempEducation.unshift(element)
							} else {
								tempEducation.push(element)
							}
						});
						this.student.education = tempEducation;

						if ( this.student && this.student.dob && this.student.dob.year ) {
							const _dob = new Date(`${this.student.dob.month}/${this.student.dob.day}/${this.student.dob.year}`);
							this.age = this.getAgeInYears( _dob );
						}
					}
				);
		}
	}

	playVideo(video: string) {
		const modalRef = this.modalService
							 .open(
								 VideoPlayerModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.video = video;
	}

	print() {
		window.print();
	}

	getAgeInYears( date: Date ) {
		const today = new Date();
		const diffTime = Math.abs( today.getTime() - date.getTime() );
		const diffYears = Math.floor( diffTime / (1000 * 60 * 60 * 24 * 365) );

		// console.log({
		// 	today: today,
		// 	dob: date,
		// 	today_: today.getTime(),
		// 	dob_: date.getTime(),
		// 	diffTime: diffTime,
		// 	diffYears: diffYears
		// });

		return diffYears;
	}

	//share(student_id: string) {
		share() {
		const modalRef = this.modalService
							 .open(
								 ShareModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = this.student_id;
		//modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => {}, reason => {});
	}

}