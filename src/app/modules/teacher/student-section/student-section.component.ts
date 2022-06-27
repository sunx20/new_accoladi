import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddStudentTModalComponent } from './add-student-modal/add-student-modal.component';
import { DeleteStudentTModalComponent } from './delete-student-modal/delete-student-modal.component';
import { TeacherService } from '../services/teacher.service';
import { StudentModel } from '../../student/models/student.model';
import { UserModel, UserService, InviteService } from '../../shared/shared.module';

import { StudentProfileModalComponent } from '../../../modules/recruiter/share/student-profile-modal.component';

@Component({
	selector: 'app-studentt-section',
	templateUrl: './student-section.component.html'
})

export class StudentSectionComponent implements OnInit {

	teacher = new UserModel({});
	students: StudentModel[];
	loadingStudents = false;
	inviteList: any = [];
	invitation: boolean = false;

	constructor(
		private modalService: NgbModal,
		private teacherService: TeacherService,
		private userService: UserService,
		private inviteService: InviteService
	) {
	}

	ngOnInit() {
		this.checkInvitation(this.userService.currentUser._id)
		this.getMyProfile();
	}

	checkInvitation(key: string) {
		this.inviteService
			.getExistInvitation(
				key
			)
			.subscribe(
				(response: any) => {
					this.invitation = false;
					this.inviteList = response.data
					if (this.inviteList.length > 0) {
						this.invitation = true;
					}
				}
			);
	}

	getMyProfile() {
		this.teacherService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.teacher = response.data;
					this.getStudents();
				},
				err => {
					console.error('SA.recruiter.dashboard.component - getUser', err );
				}
			);
	}

	getStudents() {
		this.loadingStudents = true;
		this.teacherService
			.getUserStudents()
			.subscribe(
				(response: any) => {
					this.loadingStudents = false;
					this.students = response.data;
				},
				err => {
					console.error('SA.studentSection.studentSection.component - getUserStudents', err);
				}
			);
	}

	addStudent() {
		const modalRef = this.modalService
							 .open(
								 AddStudentTModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.teacher_id = this.teacher._id;
		modalRef.result
				.then(
					(students) => {
						this.students = students;
					}, (reason) => { }
				);
	}

	removeStudent(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 DeleteStudentTModalComponent
							 );
		modalRef.componentInstance.teacher_id = this.teacher._id;
		modalRef.componentInstance.student_id = student_id;
		modalRef.result
				.then(
					(students) => {
						this.students = students;
					}, 
					(reason) => { }
				);

	}

	modalProfile(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 StudentProfileModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = student_id;
		modalRef.result.then(() => { }, reason => { });
	}

	loadInvitation(key: string) {
		this.inviteService
			.getInvitation(
				key
			)
			.subscribe(
				(response: any) => {
					this.getStudents();
					this.checkInvitation(this.userService.currentUser._id)
				}
			);
	}

	onDecline(data) {
		this.inviteService
			.declineInvitation(
				data.id
			)
			.subscribe(
				(response: any) => {
					this.checkInvitation(this.userService.currentUser._id)
				}
			);
	}

	onAccept(data) {
		this.inviteService
			.acceptInvitation(
				data.key, 
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.loadInvitation(data.key)
					this.inviteList = response.data
					if (this.inviteList.length > 0) {
						this.invitation = true;
					}
				}
			);
	}

}