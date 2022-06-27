import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { ImagechangeService } from '../../services/imagechange.service';
import { EditContactInfoComponent } from './edit-contact-info/edit-contact-info.component';
import { ChangePasswordModalComponent } from './change-password/change-password-modal.component';
import { EditUserInfoModalComponent } from './edit-user-info/edit-user-info-modal.component';
import { EditPersonalInfoComponent } from './edit-personal-info/edit-personal-info.component';
import { EditDemographicInfoComponent } from './edit-demographic-info/edit-demographic-info.component';
import { ParentService } from '../../../parent/services/parent.service';
import { VideoPlayerModalComponent } from '../video-player/video-player.component';

import { BulkUpgradeModalComponent } from '../../../parent/student-section/bulk-upgrade-modal/bulk-upgrade-modal.component';
import { RenewalPopupComponent } from './renewal-popup/renewal-popup.component';

@Component({
	selector: 'app-settings-resources',
	templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit {

	user = new UserModel({});
	parent = new UserModel({});
	students: UserModel[];
	subscriptions: any[] = [];
	months: string[];
	subscriptionHistory: [];
	current_subscription: any = null;
	defaultCard: any = null;
	imgURL: any = null;
	cancel_processing: boolean = false;
	processing: boolean = true;
	isImageSucess: boolean = false;
	bulkProcessing: boolean = false;
	cancel_sub_type: boolean;
	dob: string = '';
	sex: string = '';
	ethnicity: string = '';
	role: string = '';
	responseMsg: string = '';
	public imagePath: any;
	public message: string = '';
	public imageFile: any;
	defaultProfileImage = '../../assets/img/avatar.png';
	profile_image: string = this.defaultProfileImage;
	
	constructor(
		private modalService: NgbModal,
		private paymentService: PaymentService,
		private userService: UserService,
		//private router: Router,
		public imagechangeService: ImagechangeService,
		private parentService: ParentService
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

		this.role = this.userService.currentUser.role;
	}

	ngOnInit() {
		this.getUserProfile();
		this.getBillingHistory();

		if (this.role === 'Parent') {
			this.getDefaultPaymentMethod();
			this.parentService
				.getMyProfile()
				.subscribe(
					(response: any) => {
						this.parent = response.data;
						this.getStudents();
					},
					err => {
						console.error('SA.shared.settings.component - getMyProfile', err);
					}
				);
		}

		this.getPaymentHistory();

	}

	ngOnChanges() {
		this.setDOB();

		if (this.user.hasOwnProperty('demographics')) {
			this.sex = this.user.demographics.sex;
			this.ethnicity = this.user.demographics.ethnicity;
		}
	}

	getUserProfile() {
		this.userService
			.getUserProfile(this.userService.currentUser._id)
			.subscribe(
				(response: any) => {
					this.user = response.data;
					this.getCurrentSubscription();
					this.setDOB();
					if (this.user.hasOwnProperty('demographics')) {
						this.sex = this.user.demographics.sex;
						this.ethnicity = this.user.demographics.ethnicity;
					}
					if (this.user.hasOwnProperty('profile_imageurl')) {
						this.profile_image = this.user.profile_imageurl;
					}
				},
				err => {
					console.error(
						'SA.shared.settings.component - getUser',
						err
					);
				}
			);
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

	changePassword() {
		const modalRef = this.modalService.open(ChangePasswordModalComponent, {
			size: 'lg'
		});

		modalRef.result.then(result => {
			this.getUserProfile();
			this.getBillingHistory();
		}, reason => { });
	}

	editContactInfo() {
		const modalRef = this.modalService.open(EditContactInfoComponent, {
			size: 'lg'
		});

		modalRef.result.then(result => {
			this.getUserProfile();
			this.getBillingHistory();

		}, reason => { });
	}

	editPersonalInfo() {
		const modalRef = this.modalService.open(EditPersonalInfoComponent, {
			size: 'lg'
		});

		modalRef.result.then(result => {
			this.getUserProfile();
			this.getBillingHistory();
		}, reason => { });
	}

	editDemographicInfo() {
		const modalRef = this.modalService.open(EditDemographicInfoComponent, {
			size: 'lg'
		});

		modalRef.result.then(result => {
			this.getUserProfile();
			this.getBillingHistory();
		}, reason => { });
	}


	editUserInfoModal() {
		const modalRef = this.modalService.open(EditUserInfoModalComponent, {
			size: 'lg'
		});

		modalRef.result.then(result => {
			this.getUserProfile();
			this.getBillingHistory();
		}, reason => { });
	}
	

	getBillingHistory() {
		this.paymentService
			.getHistory(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.subscriptions = response.data;
			});
	}

	getCurrentSubscription() {
		this.paymentService
			.getCurrentSubscription(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.current_subscription = response.data;
				this.processing = false;
				this.cancel_sub_type = true;
			});
	}

	cancelSubscription(sub_id: string, type: string) {
		if (type === 'a') {
			this.cancel_processing = true;
			this.paymentService
				.cancelSubscription(this.userService.currentUser._id, sub_id, type)
				.subscribe((response: any) => {
					this.cancel_processing = false;
					this.current_subscription = response.data;
					this.getBillingHistory();
					this.cancel_sub_type = false;
				});
		} else if (type === 's') {
			this.cancel_processing = true;
			this.paymentService
				.cancelSubscription(this.userService.currentUser._id, sub_id, type)
				.subscribe((response: any) => {
					this.cancel_processing = false;
					this.current_subscription = response.data;
					this.getBillingHistory();
					this.cancel_sub_type = true;
				});
		} else {
			this.cancel_processing = true;
			this.paymentService
				.cancelSubscription(this.userService.currentUser._id, sub_id, type)
				.subscribe((response: any) => {
					this.cancel_processing = false;
					this.current_subscription = response.data;
					this.getBillingHistory();
				});
		}
	}

	cancelSubscriptionParent(sub_id: string, student_id: string, type: string) {
		this.cancel_processing = true;
		this.paymentService
			.cancelSubscription(student_id, sub_id, type)
			.subscribe((response: any) => {
				this.cancel_processing = false;
				this.getPaymentHistory();
				this.getStudents();
			});
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
			this.imgURL = null;
			return;
		} else {
			this.message = '';
		}

		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			this.imgURL = reader.result;
		};
	}

	uploadImage() {
		this.userService
			.uploadProfileImage(this.imageFile, this.userService.currentUser._id)
			.subscribe(
				res => {
					this.imagechangeService.profileImageChange(res.data.imageurl);
					this.responseMsg = 'Profile image has been successfully updated';
					this.isImageSucess = true;
				},
				error => {
					console.error(error);
					this.isImageSucess = true;
					this.responseMsg = 'Profile image update failed : ' + error.error;
					this.imgURL = null;
					setTimeout(() => { this.isImageSucess = false; }, 3000);
				},
				() => {
					this.imgURL = null;
					setTimeout(() => { this.isImageSucess = false; }, 1000);
				}
			);
	}
	
	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.video = video;
	}

	// upgrade student subscriptions
	bulkUpgrade() {
		const modalRef = this.modalService.open(BulkUpgradeModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.students = this.students.filter(s => {
			return !(
				s.membership &&
				s.membership.current_subscription &&
				(s.membership.current_subscription.status === 'active' ||
					s.membership.current_subscription.status === 'trialing')
			);
		});

		modalRef.result.then(
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

	getDefaultPaymentMethod() {
		this.paymentService.getDefaultCard(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.defaultCard = response.data;
			});
	}

	// get parent payment history
	getPaymentHistory() {
		this.paymentService
			.getParentHistory(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.subscriptionHistory = response.data;
			});
	}

	openCancelRenewPopup(data) {

		const modalRef = this.modalService.open(RenewalPopupComponent, {
			size: 'lg',
			windowClass: 'xlModal'
		});
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result !== 'skip') {
				if (this.userService.currentUser.role === 'Parent') {
					this.cancelSubscriptionParent(result.sub_id, result.student_id, result.event);
				} else {
					this.cancelSubscription(result.sub_id, result.event);
				}
			}

		}, reason => { });
	}

	// get students for bulk upgrade process
	getStudents() {
		this.parentService.getUserStudents().subscribe(
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
				console.error('SA.Shared.Settings.component - getStudents', err);
			}
		);
	}

	//to check whether users meta data available
	get isUserMetaAvailable():boolean {
		if (this.user.meta != 'undefined' && this.user.meta != null) {
			return true
		} else {
			return false
		}
	}

}
