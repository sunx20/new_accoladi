import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../models/user.model';
import { UpdateAccountModalComponent } from './update-account-modal/update-account-modal.component';
import { UserService } from '../../services/user.service';
import { ImagechangeService } from '../../services/imagechange.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html'
})

export class AccountComponent implements OnInit, OnChanges {

	@Input() user: UserModel;

	dob = '';
	months: string[];
	school: string;
	title: string;
	discipline: string;
	url: string;
	responseMsg: string = '';
	imgURL: any;
	isImageSucess = false;
	public imagePath;
	public message: string;
	public imageFile: any;

	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		public imagechangeService:ImagechangeService,
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
					console.error(
						'SA.teacher.teacher.component - getUser',
						err
					);
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
		modalRef.result.then(
			user => {
				this.user = user;
				this.setDOB();
			},
			reason => {}
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
					this.imagechangeService
						.profileImageChange(
							res.data.imageurl
						);
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