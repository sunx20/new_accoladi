import { Component, OnInit } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import * as introJs from "intro.js/intro.js";

import { UserModel, UserService } from "../../shared.module";

import { StudentService } from "../../../student/services/student.service";
import { MessagesService } from "../../../shared/shared.module";

import { InviteModalComponent } from "../profile/parent-sponsor/invite/invite-modal.component";
import { TalentService } from "../../../student/services/talent.service";
import { TalentModel } from "../../../student/models/talent.model";

@Component({
	selector: "app-student-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"]
})

export class ProfileComponent implements OnInit {

	introJS = introJs();
	student: UserModel;
	closeResult: string;
	months: string[];
	studentParents: any[];
	studentSponsors: any[];
	latestMessages: any[];
	loadingMessages = false;
	viewers: number = 5;
	searchs: number = 0;
	dob = "";
	account: any;
	talents: TalentModel;
	role: string;

	constructor(
		private modalService: NgbModal,
		private talentService: TalentService,
		private messagesService: MessagesService,
		private studentService: StudentService,
		private route: ActivatedRoute,
		private userService: UserService
	) {//console.log('PROFILE COMPONENT CONSTRUCTOR');
		this.months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];

		this.introJS.setOptions({
			steps: [
				{
					intro: "Welcome to your profile overview page!"
				},
				{
					element: "#accountstep",
					intro: "This where you can view your account information! Click `View Details` to edit your information.",
					position: "left"
				},
				{
					element: "#messagestep",
					intro: "Here you can see your latest messages! Click `View Details` to view all your messages.",
					position: "bottom"
				},
				{
					element: "#viewerstep",
					intro: "Here you can see #no of viewers ! Click `View Details` to view all viewers.",
					position: "bottom"
				},
				{
					element: "#talentstep",
					intro: "View your talents here! Click `View Details` to edit or add your talents.",
					position: "right"
				},
				{
					element: "#parentsponsorstep",
					intro: "In this section you can view the parents or sponsors linked to your account! Click `View Details` to edit or add the linked accounts.",
					position: "left"
				},
				{
					intro: 'That is all for now - Click "Done" to get started!'
				}
			]
		});
	}

	ngOnInit() {
		//console.log({'init current user = ':this.userService.currentUser});
		this.getUserAccount();
		this.getParents();
		this.getSponsors();
		this.getLatestMessages();
		this.getStudentTalents();

		// this.introJS.start(); // this will run the intro tour EVERY time the page loads
		// only run the intro tour IF the user is a first time viewer
		this.autoShowTour();

		this.route.queryParams.subscribe((params: Params) => {
			if (params['tour'] === 'true') {
				this.showTour();
			}
		});
		this.role = this.userService.currentUser.role;
	}

	autoShowTour() {
		const doneTour =
			localStorage.getItem('studentProfileTour') === 'Completed';

		if (doneTour) {
			return;
		} else {
			this.introJS.start();

			this.introJS.oncomplete(function () {
				localStorage.setItem('studentProfileTour', 'Completed');
			});

			this.introJS.onexit(function () {
				localStorage.setItem('studentProfileTour', 'Completed');
			});
		}
	}

	open(content) {
		this.modalService
			.open(content, { ariaLabelledBy: "modal-basic-title" })
			.result.then(
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

	invite() {
		const modalRef = this.modalService.open(InviteModalComponent, {
			size: "lg"
		});

		modalRef.componentInstance.student_id = this.userService.currentUser._id;
		modalRef.result.then(
			data => {
				//console.log(data);
			},
			reason => { }
		);
	}

	showTour() {
		this.introJS.start();
	}

	setDOB() {
		if (this.account && this.account.dob) {
			if (this.account.dob.month) {
				this.dob =
					this.dob + this.months[this.account.dob.month - 1] + " ";
			}
			if (this.account.dob.day) {
				this.dob = this.dob + this.account.dob.day + ", ";
			}
			if (this.account.dob.year) {
				this.dob = this.dob + this.account.dob.year;
			}
		}
	}

	getUserAccount() {
		this.userService
			.getUserAccount(this.userService.currentUser._id)
			.subscribe((result: any) => {
				this.account = result.data;
				this.setDOB();
				//console.log( 'PROFILE.COMPONENT -> getUserAccount', {'account':this.account} );
			});
	}

	getLatestMessages() {
		this.loadingMessages = true;
		this.messagesService
			.getUserLatestMessages(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.loadingMessages = false;
				this.latestMessages = response.data;
				//console.log( 'PROFILE.COMPONENT -> getLatestMessages', {'latestMessages':this.latestMessages} );
			});
	}

	getParents() {
		this.studentService
			.getStudentParents(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.studentParents = response.data;
				//console.log( 'PROFILE.COMPONENT -> getParents', {'studentParents':this.studentParents} );
			});
	}

	getSponsors() {
		this.studentService
			.getStudentSponsors(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.studentSponsors = response.data;
				//console.log( 'PROFILE.COMPONENT -> getSponsors', {'studentSponsors':this.studentSponsors} );
			});
	}

	getStudentTalents() {
		this.talentService
			.getAllStudentTalents(this.userService.currentUser._id)
			.subscribe((result: any) => {
				this.talents = result.data.talents;
				//console.log( 'PROFILE.COMPONENT -> getStudentTalents', {'talents':this.talents} );
			});
	}

	getViewersCount() {
		this.studentService
			.getCollagesViewCount(this.userService.currentUser._id)
			.subscribe(res => {
				this.viewers = res.data;
				//console.log( 'PROFILE.COMPONENT -> getViewersCount', {'viewers':this.viewers} );
			});
	}

	getSearchCount() {
		this.studentService
			.getStudentSearchCount(this.userService.currentUser._id)
			.subscribe(res => {
				this.searchs = res.data;
				//console.log( 'PROFILE.COMPONENT -> getSearchCount', {'this.searchs':this.searchs} );
			});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}
}
