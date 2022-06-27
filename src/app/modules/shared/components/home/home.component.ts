import { Component, OnInit} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as introJs from 'intro.js/intro.js';
import { UserModel } from '../../models/user.model';
import { MessagesService } from '../../services/messages.service';
import { UserService } from '../../services/user.service';
import { InviteModalComponent } from '../profile/parent-sponsor/invite/invite-modal.component';
import { StudentService } from '../../../student/services/student.service';
import { TalentService } from '../../../student/services/talent.service';
import { TalentModel } from '../../../student/models/talent.model';
import { TeacherService } from '../../../teacher/services/teacher.service';
import { ParentWizardComponent } from '../wizard/parent-wizard/parent-wizard.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	introJS = introJs();	
	student: UserModel;
	account: UserModel;
	talents: TalentModel[];
	viewers: number = 0;
	searches: number = 0;
	latestMessages: any[];
	camps: any[] = [];
	honors: any[] = [];
	vid: any[] = [];
	ed: any[] = [];
	pref: any[] = [];
	badges: any;
	role: string = '';
	dob: string = '';
	badge: string = '';
	closeResult: string = '';
	months: string[];
	badge_description: string = '';
	loadingMessages: boolean = false;
	teacherDisabled: boolean;
	public defaultProfileImage = '../../assets/img/avatar.png';

	constructor(
		private modalService: NgbModal,
		private messagesService: MessagesService,
		private studentService: StudentService,
		private route: ActivatedRoute,
		private talentService: TalentService,
		private userService: UserService,
		private teacherService: TeacherService
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

		this.introJS.setOptions({
			steps: [
				{
					intro:
						'Welcome to Accoladi.com! This is your home page (or dashboard) Click `next` to step through the tour'
				},
				{
					element: '#home-welcome-banner',
					intro:
						'The masthead is a welcome point, it may contain messages or videos or hints to help you stay current and searchable! click the `Getting Started Checklist` to find out how to make the most of our system.Resources are being added constantly, so check back frequently and add to or keep you data current!',
					position: 'bottom'
				},
				{
					element: '#account-short-card',
					intro:
						'Here is an summary of your account information! Click `View Details` to edit your information.',
					position: 'left'
				},
				{
					element: '#messages-card',
					intro:
						'The Message box shows your latest messages! Click `View More` to view all your messages.',
					position: 'right'
				},
				{
					element: '#talents-card',
					intro:
						'Here is a summary of your talents! Click `View Details` to edit or add your talents.',
					position: 'left'
				},
				{
					element: '#invite-card',
					intro: 'Invite your friends, parents and teachers here!',
					position: 'right'
				},
				// {
				// 	element: '#profile-strength-card',
				// 	intro: 'View your Profile strength! We will rate and evaluate your entire prifile and give you a indicatotion of how strong you are compared requiremens that recruiters have shared with us.',
				// 	position: 'right'
				// },
				// {
				// 	element: '#college-views-card',
				// 	intro: 'Here you can see a count of colleges or universities that have viewed your profile.',
				// 	position: 'right'
				// },
				// {
				// 	element: '#appeared-searches-card',
				// 	intro: 'This is a running total of search results you have been apart of.',
				// 	position: 'right'
				// },
				{
					element: '#student-side-nav',
					intro: 'Navigation to ALL areas available to you.',
					position: 'left'
				},
				{
					intro: 'That is all for now - Click `Done` to get started!'
				}
			]
		});
		this.introJS.setOptions({
			tooltipPosition: 'auto'
		});
		this.introJS.setOptions({
			positionPrecedence: ['left', 'right', 'bottom', 'top']
		});
	}

	ngOnInit() {
		this.badges = {
			location: 'compass_gs.svg',
			dates: 'calendar_gs.svg',
			talents: 'talent_gs.svg',
			schools: 'school_gs.svg',
			videos: 'video_gs.svg',
			honors: 'honors_gs.svg',
			camps: 'camp_gs.svg'
		};

		this.getUserAccount();
		this.getLatestMessages();
		this.getViewersCount();
		this.getSearchCount();
		this.getStudentTalents();
		this.getStudentHonors();
		this.getStudentSummerEnrichments();
		this.getStudentEd();
		this.getStudentVid();
		// this.introJS.start(); // this will run the intro tour EVERY time the page loads
		// only run the intro tour IF the user is a first time viewer
		this.autoShowTour();

		this.route.queryParams.subscribe((params: Params) => {
			if (params['tour'] === 'true') {
				//this.showTour();
			}
		});
		this.role = this.userService.currentUser.role;

		if (this.userService.currentUser.role == 'Teacher') {
			this.teacherDisabled = false;
		} else if (this.userService.currentUser.role == 'Student') {
			this.teacherDisabled = true;
		}
	}

	autoShowTour() {
		console.log('Home Tour Starting...');

		if (this.userService.currentUser.role == 'Student') {
			const doneTour =
				localStorage.getItem('studentHomeTour') === 'Completed';

			if (doneTour) {
				return;
			} else {
				this.introJS.start();

				this.introJS.oncomplete(function () {
					localStorage.setItem('studentHomeTour', 'Completed');
				});

				this.introJS.onexit(function () {
					localStorage.setItem('studentHomeTour', 'Completed');
				});
			}
		} else if (this.userService.currentUser.role == 'Teacher') {
			const doneTour =
				localStorage.getItem('teacherHomeTour') === 'Completed';

			if (doneTour) {
				return;
			} else {
				this.introJS.start();

				this.introJS.oncomplete(function () {
					localStorage.setItem('teacherHomeTour', 'Completed');
				});

				this.introJS.onexit(function () {
					localStorage.setItem('teacherHomeTour', 'Completed');
				});
			}
		}
	}

	showTour() {
		this.introJS.start();
	}

	setDOB() {
		if (this.account && this.account.dob) {
			if (this.account.dob.month) {
				this.dob =
					this.dob + this.months[this.account.dob.month - 1] + ' ';
			}

			if (this.account.dob.day) {
				this.dob = this.dob + this.account.dob.day + ', ';
			}

			if (this.account.dob.year) {
				this.dob = this.dob + this.account.dob.year;
			}
		}
	}

	getLatestMessages() {
		this.loadingMessages = true;
		this.messagesService
			.getUserLatestMessages(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.loadingMessages = false;
					this.latestMessages = response.data;
					console.log(this.latestMessages);
				}
			);
	}

	getViewersCount() {
		// for student
		if (this.userService.currentUser.role == 'Student') {
			this.studentService
				.getCollagesViewCount(
					this.userService.currentUser._id
				)
				.subscribe(
					res => {
						this.viewers = res.data;
						console.log(res);
					}
				);
		} else if (this.userService.currentUser.role == 'Teacher') {
			// for teacher
			this.teacherService
				.getCollagesViewCount(
					this.userService.currentUser._id
				)
				.subscribe(
					res => {
						this.viewers = res.data;
						console.log(res);
					}
				);
		}
	}

	getSearchCount() {
		if (this.userService.currentUser.role == 'Student') {
			this.studentService
				.getStudentSearchCount(
					this.userService.currentUser._id
				)
				.subscribe(
					res => {
						this.searches = res.data;
						console.log(res);
					}
				);
		} else if (this.userService.currentUser.role == 'Teacher') {
			this.teacherService
				.getTeacherSearchCount(
					this.userService.currentUser._id
				)
				.subscribe(
					res => {
						this.searches = res.data;
						console.log(res);
					}
				);
		}
	}

	getUserAccount() {
		this.userService
			.getUserAccount(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => {
					this.account = result.data;
					this.setDOB();
					if (this.account.address.postal_code) {
						this.badges.location = 'compass.svg';
					}
					if (this.account.graduation_year && this.account.dob.year) {
						this.badges.dates = 'calendar.svg';
					}
				}
			);
	}

	getStudentTalents() {
		this.talentService
			.getAllStudentTalents(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => {
					this.talents = result.data.talents;
					if (this.talents.length) {
						this.badges.talents = 'talent.svg';
					}
				}
			);
	}

	getStudentHonors() {
		this.studentService
			.getStudentHonors(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => {
					this.honors = result.data.honors_awards;
					if (this.honors.length) {
						this.badges.honors = 'honors.svg';
					}
				}
			);
	}

	getStudentSummerEnrichments() {
		this.studentService
			.getStudentSummerEnrichments(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => {
					this.camps = result.data.summer_enrichments;
					if (this.camps.length) {
						this.badges.camps = 'camp.svg';
					}
				}
			);
	}

	getStudentEd() {
		this.studentService
			.getStudentCurrentEd(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => {
					this.ed = result.data.cur;
					this.studentService
						.getStudentCollegePrefs(
							this.userService.currentUser._id
						)
						.subscribe(
							(resultP: any) => {
								this.pref = resultP.data.college_pref.majors;
								if (this.ed.length && this.pref.length) {
									this.badges.schools = 'school.svg';
								}
							}
						);
				}
			);
	}

	getStudentVid() {
		this.studentService
			.getStudentVideos(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => { 
					this.vid = ( result.data ? result.data : [] );
					if (this.vid.length) {
						this.badges.videos = 'video.svg';
					}
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

	openWizardContent(){
			const modalRef = this.modalService
								 .open(
									 ParentWizardComponent, 
									 { size: 'lg' }
								 );
	
			modalRef.result
					.then(
						result => {	}, reason => { }
					);
		
	}

	invite() {
		const modalRef = this.modalService
							 .open(
								 InviteModalComponent, 
								 { size: 'lg' }
							 );

		modalRef.componentInstance.student_id = this.userService.currentUser._id;
		modalRef.result
				.then(
					data => {
						console.log(data);
					},
					reason => { }
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