import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdateAccountModalComponent } from '../../shared/components/account/update-account-modal/update-account-modal.component';
import { UserModel, PaymentService } from '../../shared/shared.module';
import { BulkUpgradeModalComponent } from '../student-section/bulk-upgrade-modal/bulk-upgrade-modal.component';
import { UserService } from '../../shared/services/user.service';
import { ParentService } from '../services/parent.service';
import { SaveStripeCardComponent } from './../../shared/components/billing/save-stripe-card/save-stripe-card.component';
import { ImagechangeService } from '../../shared/services/imagechange.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit, OnChanges {

	@Input() user: UserModel;

	parent = new UserModel({});
	students: UserModel[];
	public imagePath;
	public message: string;
	public imageFile: any;
	imgURL: any;
	dob = '';
	months: string[];
	school: string;
	title: string;
	discipline: string;
	url: string;
	subscriptionHistory: []; // object;
	bulkProcessing = false;
	cancel_processing = false;
	defaultCard: any;
	isImageSucess = false;
	responseMsg: string = '';

	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private parentService: ParentService,
		private paymentService: PaymentService,
		public activeModal: NgbActiveModal,
		public imagechangeService:ImagechangeService
	) {
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
	}

	ngOnInit() {
		this.getUserProfile();
		this.getPaymentHistory();
		this.getDefaultPaymentMethod();
		this.parentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.parent = response.data;
					this.getStudents();
				},
				err => {
					console.error('SA.teacher.teacher.component - getUser', err);
				}
			);
	}

	getUserProfile() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.user = response.data;
					this.setDOB();
					this.setSchoolInfos();
					this.showPopup();
				},
				err => {
					console.error('SA.teacher.teacher.component - getUser', err);
				}
			);
	}

	showPopup() {
		setTimeout(() => {
			if (this.user && !this.addressProvided(this.user.address)) {
				this.updateAccount('Please fill in address information');
			}
		}, 2000);
	}

	setSchoolInfos() {
		this.school = '';
		this.title = '';
		this.discipline = '';
		this.url = '';

		if (this.user && this.user.meta && this.user.meta.verified) {
			if (this.user.meta.verified.title) {
				this.title = this.user.meta.verified.title;
			}
			if (this.user.meta.verified.title) {
				this.discipline = this.user.meta.verified.discipline;
			}
			if (this.user.meta.verified.faculty_url) {
				this.url = this.user.meta.verified.faculty_url;
			}
			if (this.user.meta.verified.school.name) {
				this.school = this.user.meta.verified.school.name;
			}
		}
	}

	ngOnChanges() {
		this.setDOB();
	}

	setDOB() {
		if (this.user && this.user.dob) {
			this.dob = '';
			if (this.user.dob.month) {
				this.dob = this.dob + this.months[this.user.dob.month - 1] + ' ';
			}
			if (this.user.dob.day) {
				this.dob = this.dob + this.user.dob.day + ', ';
			}
			if (this.user.dob.year) {
				this.dob = this.dob + this.user.dob.year;
			}
		}
	}

	addressProvided(address: any) {
		if (!address.city || !address.state || !address.postal_code) {
			return false;
		}
		return true;
	}

	updateAccount(msg = '') {
		const modalRef = this.modalService
							 .open(
								 UpdateAccountModalComponent, 
								 { size: 'lg' }
							 );

		modalRef.componentInstance.user_id = this.user._id;
		modalRef.componentInstance.msg = msg;
		modalRef.result
				.then(
					user => {
						this.user = user;
						this.setDOB();
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
				(s.membership.current_subscription.status === 'active' ||
					s.membership.current_subscription.status === 'trialing')
			);
		});

		modalRef.result
				.then(
					(result: any) => {
						this.bulkProcessing = true;
						result.obs.subscribe((response: any) => {
							setTimeout(() => {
								this.getStudents();
								this.getPaymentHistory();
								this.getDefaultPaymentMethod();
							}, 3000);
						});
					},
					reason => { }
				);
	}

	getStudents() {
		this.parentService
			.getUserStudents()
			.subscribe(
				async (response: any) => {
					this.students = await Promise.all<UserModel>(
						response.data.map((student: any) => {
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
												origin_name:
													sub_res.data.origin_name
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
					console.error('SA.studentSection.studentSection.component - getUserStudents', err);
				}
			);
	}

	getPaymentHistory() {
		this.paymentService
			.getParentHistory(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.subscriptionHistory = response.data;
				}
			);
	}

	cancelSubscription(sub_id: string, student_id: string, type: string) {
		this.cancel_processing = true;
		this.paymentService
			.cancelSubscription(
				student_id, 
				sub_id, 
				type
			)
			.subscribe(
				(response: any) => {
					this.cancel_processing = false;
					this.getPaymentHistory();
					this.getStudents();
				}
			);
	}

	getDefaultPaymentMethod() {
		this.paymentService
			.getDefaultCard(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.defaultCard = response.data;
				}
			)
	}

	editDefaultCard() {
		const modalRef = this.modalService
							 .open(
								 SaveStripeCardComponent, 
								 {
									size: 'lg',
									backdrop: 'static',
									keyboard: false
								}
							 );

		modalRef.result
				.then(
					(token: any) => {
						// update default card
						this.paymentService
							.saveDefaultCard(
								this.userService.currentUser._id, 
								token
							)
							.subscribe((customer: any) => {
								this.getDefaultPaymentMethod();
							});
					},
					reason => { }
				);
	}

	selectImage(files: FileList) {
		this.imageFile = files.item(0);

		if (files.length === 0) {
			return;
		}

		const mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = 'Only images are supported.';
			return;
		} else {
			this.message = '';
		}

		if (files[0].size > 3145728) {
			this.message = 'maxium Profile image size 3MB.';
			this.imgURL =null;
			return;
		} else {
			this.message = '';
		}

		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			this.imgURL = reader.result;
		}
	}

	uploadImage() {
		this.userService
			.uploadProfileImage(
				this.imageFile, 
				this.userService.currentUser._id
			)
			.subscribe(
				res => {
					// console.log(res)
					// let data=res.data;
					this.imagechangeService.profileImageChange(res.data.imageurl);
					this.responseMsg = 'Profile image has been successfully updated';
					this.isImageSucess = true;
				},
				error => {
					this.isImageSucess = true;
					console.error(error);
					this.responseMsg = 'Profile image update failed : ' + error.error;
					this.imgURL = null;
					setTimeout(() => { this.isImageSucess = false; }, 3000);
				},
				() => {
					this.imgURL = null;
					setTimeout(() => {	this.isImageSucess=false;}, 1000);
				}
			)
	}

}
