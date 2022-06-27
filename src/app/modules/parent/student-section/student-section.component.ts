import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddStudentPModalComponent } from './add-student-modal/add-student-modal.component';
import { UpdateStudentPModalComponent } from './update-student-modal/update-student-modal.component';
import { DeleteStudentPModalComponent } from './delete-student-modal/delete-student-modal.component';
import { PremiumModalComponent } from './premium-modal/premium-modal.component';
import { BulkUpgradeModalComponent } from './bulk-upgrade-modal/bulk-upgrade-modal.component';

import { PaymentService, UserModel, InviteService, UserService } from '../../../modules/shared/shared.module';
import { ParentService } from '../services/parent.service';
import { StudentProfileModalComponent } from '../../../modules/recruiter/share/student-profile-modal.component';

@Component({
	selector: 'app-studentp-section',
	templateUrl: './student-section.component.html'
})

export class StudentPSectionComponent implements OnInit {

	parent = new UserModel({});
	students: UserModel[] = [];
	current_date: Date = new Date();
	current_subscription = null;
	bulkProcessing = false;
	studentAddSucess: any;
	invitation: boolean = false;
	inviteList: any = [];

	constructor(
		private router: Router,
		public userService: UserService,
		private modalService: NgbModal,
		private parentService: ParentService,
		private paymentService: PaymentService,
		public activeModal: NgbActiveModal,
		private inviteService: InviteService
	) { }

	ngOnInit() {
		this.checkInvitation(this.userService.currentUser._id)
		this.parentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.parent = response.data;
					this.getStudents();
				},
				err => {
					console.error('SA.parent.studentSection.component - getUser', err);
				}
			);
	}

	checkInvitation(key: string) {
		this.inviteService
			.getExistInvitation(
				key
			)
			.subscribe(
				(response: any) => {
					this.invitation=false;
					this.inviteList=response.data
					if (this.inviteList.length>0) {
						this.invitation=true;
					}
				}
			);
	}

	getCurrentSubscriptionByStudent(sid: string) {
		this.paymentService
			.getCurrentSubscription(
				sid
			)
			.subscribe(
				(response: any) => {
					this.current_subscription = response.data;
				}
			);
	}

	getStudents() {
		this.parentService
			.getUserStudents()
			.subscribe(
				async (response: any) => {
					this.students = await Promise.all<UserModel>(
						response.data
								.map((student: any) => {
									return new Promise(async (resolve, reject) => {
										const sub_res: any = await this.paymentService
																	   .getCurrentSubscription(student._id)
																	   .toPromise();
										let fstudent = null;
										this.bulkProcessing = false;
										if (sub_res.data) {
											fstudent = {
												...student,
												membership: {
													...student.membership,
													current_subscription: {
														type: sub_res.data.type,
														status: sub_res.data.status,
														start: sub_res.data.start,
														end: sub_res.data.end,
														origin: sub_res.data.origin,
														origin_name: sub_res.data.origin_name
													}
												}
											};
										} else {
											fstudent = student;
										}
										resolve(fstudent);
									});
								})
					);
				},
				err => {
					console.error('SA.parent.studentSection.component - getUserStudents', err);
				}
			);
	}

	addStudent() {
		const modalRef = this.modalService
							 .open(
								 AddStudentPModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.parent_id = this.parent._id;
		modalRef.componentInstance
				.addStudentSucess
				.subscribe( result => {
					this.studentAddSucess = result;
				});
		modalRef.result
				.then(
					students => {
						setTimeout(() => {
							this.getStudents();
							this.activeModal.close();
						}, 2000);
					},
					reason => { }
				);
	}

	updateStudent(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 UpdateStudentPModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.parent_id = this.parent._id;
		modalRef.componentInstance.student_id = student_id;
		modalRef.result
				.then(
					students => {
						this.getStudents();
					},
					reason => { }
				);
	}

	removeStudent(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 DeleteStudentPModalComponent
							 );
		modalRef.componentInstance.parent_id = this.parent._id;
		modalRef.componentInstance.student_id = student_id;
		modalRef.result
				.then(
					students => {
						this.getStudents();
					},
					reason => { }
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

	viewDetails(student_id: string) {
		this.router.navigate(['/parent/students/' + student_id]);
	}

	showPremiumModal(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 PremiumModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.parent_id = this.parent._id;
		modalRef.result
				.then(
					() => {
						this.getStudents();
					},
					reason => { }
				);
	}

	bulkUpgrade() {
		const modalRef = this.modalService
							 .open(
								 BulkUpgradeModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.students = this.students.filter(s => {
			return !(
				s.membership &&
				s.membership.current_subscription &&
				(
					s.membership.current_subscription.status === 'active' ||
					s.membership.current_subscription.status === 'trialing'
				)
			);
		});

		modalRef.result
				.then(
					(result: any) => {
						this.bulkProcessing = true;
						result.obs.subscribe((response: any) => {
							console.log(response);
							setTimeout(() => {
								this.getStudents();
							}, 3000);
						});
					},
					reason => { }
				);
	}

	reloadStudentData() { 

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
					this.inviteList=response.data
					if (this.inviteList.length>0) {
						this.invitation=true;
					}
				}
			);
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
	
}
