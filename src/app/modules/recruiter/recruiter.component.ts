import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationStart } from '@angular/router';

import { AuthService } from '../../modules/auth/auth.service';
import { DataService, UserService } from '../../modules/shared/shared.module';
import { UserModel } from '../../modules/shared/shared.module';
import { RecruiterService } from './services/recruiter.service';

@Component({
	selector: 'app-recruiter',
	templateUrl: './recruiter.component.html',
	styleUrls: ['../shared/components/public/public.component.css','./recruiter.component.css']
})

export class RecruiterComponent implements OnInit, AfterViewInit {

	@ViewChild('t') tab: any;

	public recruiter = new UserModel({});
	public student = new UserModel({});

	school: string = '';
	title: string = '';
	showWelcome: boolean = false;
	showSidebar: boolean = false;
	closeResult: string = '';
	faculty_for: any[] = [];

	constructor(
		private authService: AuthService,
		private router: Router,
		private modalService: NgbModal,
		private recruiterService: RecruiterService,
		private dataService: DataService,
		private userService: UserService
	) {
		this.school = '';
		this.title = '';
		this.showWelcome = true;
	}

	ngOnInit() {
		this.dataService
			.currentMessage
			.subscribe(message => {
				this.student = message;
			});

		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
					// if (this.recruiter.meta && this.recruiter.meta.verified) {
					// 	if (this.recruiter.meta.verified.title) {
					// 		this.title = this.recruiter.meta.verified.title;
					// 	}
					// 	if (this.recruiter.meta.verified.school && this.recruiter.meta.verified.school.name) {
					// 		this.school = ' - ' + this.recruiter.meta.verified.school.name;
					// 	}
					// }
					this.faculty_for = response.data.faculty_for;

					if ( this.recruiter.role !== 'Recruiter' ) {
						this.authService.logout();
						this.router.navigate(['/login']);
					}
				},
				err => {
					console.error('SA.recruiter.recruiter.component - getUser', err);
				}
			);

		this.userService
			.sidebarSubject
			.subscribe(
				(response: any) => {
					debugger;
					this.showSidebar = response === 'true';
				}
			);

		this.router
			.events
			.filter(
				event => event instanceof NavigationStart
			)
			.subscribe(
				(event: NavigationStart) => { // console.log(event.url);
				// if (event.url === '/recruiter/account') {
				// 	this.showWelcome = true;
				// } else {
				// 	this.showWelcome = false;
				// }
				}
			);
	}

	ngAfterViewInit() {
		// setTimeout(() => this.tab.select('dashboard-tab'), 1000);
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
