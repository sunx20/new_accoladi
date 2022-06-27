import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../../modules/shared/shared.module';

@Component({
	selector: 'app-parent-student-details',
	templateUrl: './parent-student-details.component.html'
})

export class ParentStudentDetails implements OnInit {
	student: any;

	constructor(
		private router: Router,
		private userService: UserService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.route
			.params
			.subscribe(
				(params: Params) => {
				if (params['sid']) {
					this.getStudentProfile(params['sid']);
				}
			}
		);
	}

	getStudentProfile(user_id: string) {
		this.userService
			.getUserProfile(
				user_id
			)
			.subscribe(
				(response: any) => {
					this.student = response.data;
					console.log('Student Profile', this.student);
				},
				err => {
					console.error('Unable to get student profile', err);
				}
			);
	}

	goBack() {
		this.router.navigate(['/parent']);
	}
}
