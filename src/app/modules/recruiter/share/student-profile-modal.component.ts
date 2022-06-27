import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { ImagechangeService } from '../../../modules/shared/services/imagechange.service';

@Component({
	selector: 'app-student-profile',
	templateUrl: './student-profile-modal.component.html'
})

export class StudentProfileModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() recruiter_id: string;

	public defaultProfileImage = '../../assets/img/avatar.png';
	public profileImage: any = null;

	current_role: string;
	student: UserModel = null;

	constructor(
		public activeModal: NgbActiveModal,
		private userService: UserService,
		private route: ActivatedRoute,
		public imagechangeService: ImagechangeService,
	) {

	}

	ngOnInit() {
		this.route
			.params
			.subscribe(
				(params: Params) => {
					if (params['sid']) {
						this.student_id = params['sid'];
					}
					this.userService
						.getUserProfile(
							this.student_id
						)
						.subscribe(
							(response: any) => {
								this.student = response.data;
								this.student_id = this.student._id;
								this.imagechangeService.profileImgChange$.subscribe(
									res => {
										this.profileImage = res.imgUrl;
									}
								);
							}
						);
				}
			);

		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.current_role = response.data.role;
					if ( this.current_role === 'Recruiter' ) {
						this.recruiter_id = response.data._id;
					} else {
						this.recruiter_id = '';
					}
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}