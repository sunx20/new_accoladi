import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddMasterClassModalComponent } from './add-master-class-modal/add-master-class-modal.component';
import { UpdateMasterClassModalComponent } from './update-master-class-modal/update-master-class-modal.component';
import { DeleteMasterClassModalComponent } from './delete-master-class-modal/delete-master-class-modal.component';

import {
	VideoPlayerModalComponent,
	UserModel,
	UserService
} from '../../../../shared/shared.module';
import { MasterClassService } from '../../../../student/services/master-class.service';

@Component({
	selector: 'app-master-class',
	templateUrl: './master-class.component.html'
})

export class MasterClassComponent implements OnInit {

	@Input() student: UserModel;

	master_classes: any;
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private masterClassService: MasterClassService
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
			this.masterClassService
				.getAllStudentMCs(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
					this.master_classes = response.data.master_classes;
				}
			);
		} else {
			this.studentId = this.student._id;
			this.master_classes = this.student.master_classes;
		}
	}

	addStudentMC() {
		let modalRef = this.modalService
							.open(
								AddMasterClassModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.master_classes = user.master_classes;
					},
					reason => { }
				);
	}

	updateStudentMC(mcid: string) {
		let modalRef = this.modalService
							.open(
								UpdateMasterClassModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mcid = mcid;
		modalRef.result
				.then(
					user => {
						this.master_classes = user.master_classes;
					},
					reason => { }
				);
	}

	removeStudentMC(mcid: string) {
		let modalRef = this.modalService
							.open(
								DeleteMasterClassModalComponent
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mcid = mcid;
		modalRef.result
				.then(
					user => {
						this.master_classes = user.master_classes;
					},
					reason => { }
				);
	}

	playVideo(video: string) {
		let modalRef = this.modalService
							.open(
								VideoPlayerModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.video = video;
	}
	
}
