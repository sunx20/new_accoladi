import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../modules/auth/auth.service';
import { TeacherService } from './services/teacher.service';
import { UserModel, UserService } from '../shared/shared.module';

@Component({
	selector: 'app-teacher',
	templateUrl: './teacher.component.html'
})

export class TeacherComponent implements OnInit {

	showWelcome: boolean;
	showMockProfileMsg: boolean;
	showSidebar = false;
	closeResult: string;
	teacher = new UserModel({});
	currentPath = '';

	constructor(
		private authService: AuthService,
		private router: Router,
		private modalService: NgbModal,
		private teacherService: TeacherService,
		private userService: UserService
	) {
		this.router
			.events
			.filter(
				event => event instanceof NavigationEnd
			)
			.subscribe(
				(event: NavigationEnd) => {
					if ( event.url.includes( 'profile' ) || event.url.includes( 'performance' ) || event.url.includes( 'education' ) ) {
						this.showWelcome = false;
						this.showMockProfileMsg = true;
					} else {
						this.showWelcome = true;
						this.showMockProfileMsg = false;
					}
				}
			);
	}

	ngOnInit() {
		this.teacherService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.teacher = response.data;
					if ( this.teacher.role !== 'Teacher' ) {
						this.authService.logout();
						this.router.navigate(['/login']);
					}
				},
				err => {
					console.error('SA.teacher.teacher.component - getUser', err);
				}
			);

		this.userService
			.sidebarSubject
			.subscribe(
				(response: any) => {
					this.showSidebar = response === 'true';
				}
			);
	}

	open(content) {
		this.modalService
			.open(
				content, 
				{ ariaLabelledBy: 'modal-basic-title' }
			)
			.result
			.then(
				result => {
					this.closeResult = `Closed with: ${result}`;
				},
				reason => {
					this.closeResult = `Dismissed ${this.getDismissReason(
						reason
					)}`;
				}
			);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

}