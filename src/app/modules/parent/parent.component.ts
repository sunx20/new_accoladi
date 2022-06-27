import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../modules/auth/auth.service';
import { UserModel, UserService } from '../../modules/shared/shared.module';
import { ParentService } from './services/parent.service';

@Component({
	selector: 'app-parent',
	templateUrl: './parent.component.html'
})

export class ParentComponent implements OnInit {

	showWelcome: boolean;
	showSidebar = false;
	closeResult: string;
	parent = new UserModel({});

	constructor(
		private authService: AuthService,
		private router: Router,
		private modalService: NgbModal,
		private parentService: ParentService,
		private userService: UserService
	) {
		this.showWelcome = true;
	}

	ngOnInit() {
		this.parentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.parent = response.data;
					if ( this.parent.role !== 'Parent') {
						this.authService.logout();
						this.router.navigate(['/login']);
					} 
				},
				err => {
					console.error( 'SA.parent.parent.component - getUser', err );
				}
			);

		this.userService
			.sidebarSubject
			.subscribe(
				(response: any) => {
					this.showSidebar = response == 'true';
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