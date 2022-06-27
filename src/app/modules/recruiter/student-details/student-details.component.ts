import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService, UserModel } from '../../../modules/shared/shared.module';

@Component({
	selector: 'app-student-details',
	templateUrl: './student-details.component.html'
})

export class StudentDetails implements OnInit {

	student: UserModel = null;
	student_id: string = '';
	recruiter_id: string = '';
	role: string = '';

	constructor(
		private router: Router,
		private userService: UserService,
		// private modalService: NgbModal,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.route
			.params
			.subscribe((params: Params) => {
			if (params['sid']) {
				this.student_id = params['sid'];
			}
			this.userService
				.getUserProfile(this.student_id)
				.subscribe((response: any) => {
					this.student = response.data;
					this.student_id = this.student._id;
				});
		});

		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.role = response.data.role;
					this.recruiter_id = response.data._id;
				}
			);
	}

	goBack() {
		this.router.navigate(['/recruiter/search/talent']);
	}

}
