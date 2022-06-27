import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnterConversationModalComponent, DataService, UserModel } from '../../../modules/shared/shared.module';
import { SavedStudentsService } from '../services/saved-students.service';
import { RecruiterService } from '../services/recruiter.service';
import { ShareModalComponent } from '../share/share-modal.component';

import { StudentProfileModalComponent } from '../share/student-profile-modal.component';

@Component({
	selector: 'app-recruiter-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

	recruiter = new UserModel({});
	student = new UserModel({});
	intoLetterList: any[];
	refLetterList: any[];
	savedStudentsList: any[];
	studentProfile: string;
	removingStudentId = '';

	constructor(
		private recruiterService: RecruiterService,
		private recruiterSSTService: SavedStudentsService,
		private dataService: DataService,
		private modalService: NgbModal,
		private route: ActivatedRoute
	) {
		this.route
			.params
			.subscribe(
				(params: Params) => {
					if (params['sid']) {
						setTimeout(() => this.modalProfile(params['sid']), 2000);
					}
				}
			);
	}

	ngOnInit() {
		this.dataService
			.currentMessage
			.subscribe(
				message => (this.studentProfile = message)
			);
		this.intoLetterList = [];
		this.refLetterList = [];
		this.savedStudentsList = [];
		this.getMyProfile();
	}

	getMyProfile() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
					this.getStudentsWithIntroductionLetters();
					this.getStudentsWithReferenceLetters();
					this.getSavedStudents();
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getUser', err );
				}
			);
	}

	getStudentsWithIntroductionLetters() {
		this.recruiterService
			.getStudentsWithIntroductionLetters(
				this.recruiter._id, 
				5
			)
			.subscribe(
				(response: any) => {
					this.intoLetterList = response.data.map(student => {
						return {
							...student,
							events: Array.from(
								new Set(student.honors.map(h => h.event))
							)
						};
					});
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getStudentsWithIntroductionLetters', err );
				}
			);
	}

	getStudentsWithReferenceLetters() {
		this.recruiterService
			.getStudentsWithReferenceLetters(
				this.recruiter._id, 
				5
			)
			.subscribe(
				(response: any) => {
					this.refLetterList = response.data.map(student => {
						return {
							...student,
							events: Array.from(
								new Set(student.honors.map(h => h.event))
							)
						};
					});
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getStudentsWithReferenceLetters', err );
				}
			);
	}

	getSavedStudents() {
		this.recruiterSSTService
			.getSavedStudents(
				this.recruiter._id, 
				10
			)
			.subscribe(
				(response: any) => {
					this.savedStudentsList = response.data;
					this.removingStudentId = '';
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getSavedStudents', err );
				}
			);
	}

	modalProfile(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 StudentProfileModalComponent, 
								 { size: 'lg' }
							);
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => { }, reason => { });
	}

	sendMessage(recipient_id: string) {
		const modalRef = this.modalService
							 .open(
								 EnterConversationModalComponent, 
								 { size: 'lg' }
							);

		modalRef.componentInstance.user_id = this.recruiter._id;
		if (recipient_id) {
			modalRef.componentInstance.recipient_id = recipient_id;
		}

		modalRef.result
				.then(
					() => {
						// this.getThreads();
					},
					reason => {
						// this.getThreads();
					}
				);
	}

	removeSaved(student_id: string) {
		this.removingStudentId = student_id;
		this.recruiterSSTService
			.removeStudentFromSaved(
				student_id
			)
			.subscribe(
				(response: any) => {
					this.getSavedStudents();
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getSavedStudents', err );
				}
			);
	}

	isRemovingStudent(sid: string) {
		return this.removingStudentId === sid;
	}

	shareStudent(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 ShareModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => {}, reason => {});
	}
	
}
