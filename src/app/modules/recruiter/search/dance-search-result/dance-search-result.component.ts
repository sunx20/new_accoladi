import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnterConversationModalComponent, GoogleAnalyticsEventsService, UserModel, UserService } from '../../../../modules/shared/shared.module';
import { StudentProfileInteraction } from '../../models/student-profile-visit';
import { studentSearchLogModel } from '../../models/student-search-log.model';
import { RecruiterService } from '../../services/recruiter.service';
import { SavedStudentsService } from '../../services/saved-students.service';
import { StudentSearchLogService } from '../../services/student-search-log.service';
import { ShareModalComponent } from '../../share/share-modal.component';
import { StudentProfileModalComponent } from '../../share/student-profile-modal.component';

@Component({
	selector: 'app-dance-search-result',
	templateUrl: './dance-search-result.component.html'
})
export class DanceSearchResultComponent implements OnInit, OnChanges {

	@Input() response: any;
	@Input() recruiter: any;
	@Input() total: number;
	@Input() page: number;
	@Input() pageSize: number;

	@Output() paginate: EventEmitter<any> = new EventEmitter();
	@Output() scrollTo: EventEmitter<any> = new EventEmitter();

	searchResults: any;
	searchCriteria = '';
	studentProfile = new UserModel({});
	savingStudentId = '';
	savedStudentsList: any[];
	searchLog = new studentSearchLogModel({});

	constructor(
		private recruiterService: RecruiterService,
		private recruiterSSTService: SavedStudentsService,
		private userService: UserService,
		private modalService: NgbModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private studentSLService: StudentSearchLogService
	) {
		this.searchResults = [];
		this.savedStudentsList = [];
	}

	ngOnInit() {
		this.response;
		this.recruiter;
		this.total;
		this.page;
		this.pageSize;
		this.getSavedStudents();
		this.updateSearchResults();
		this.scrollTo.emit()
	}

	ngOnChanges() {
		this.updateSearchResults();
	}

	updateSearchResults() {
		if (this.response) {
			this.searchResults = this.response.search;
			this.total = this.response.total;
			this.searchCriteria = this.response.criteria;
		}
	}

	sendMessage(recipient_id: string) { // this.router.navigate(['/messages', student_id]);
		const modalRef = this.modalService
							 .open(
								 EnterConversationModalComponent, 
								 { size: 'lg' }
							 );

		modalRef.componentInstance.user_id = this.recruiter._id;
		if (recipient_id) {
			modalRef.componentInstance.recipient_id = recipient_id;
		}

		modalRef.result
				.then(
					() => {
						// this.getThreads();
					},
					reason => {
						// this.getThreads();
					}
				);
	}

	getSavedStudents() {
		this.recruiterSSTService
			.getSavedStudents(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.savedStudentsList = response.data;
					this.savingStudentId = '';
				},
				err => {
					console.error('SA.recruiter.search.component - getSavedStudents', err);
				}
			);
	}

	saveStudent(student_id: string) {
		this.savingStudentId = student_id;
		this.recruiterSSTService
			.saveStudent(
				student_id
			)
			.subscribe(
				(response: any) => {
					let viewProfileLog: StudentProfileInteraction = {
						student_id: student_id,
						searcher_id: this.recruiter._id,
						actions: {
							saved: true
						}
					}
					this.recruiterService
						.recruiterViewedProfile(
							viewProfileLog, 
							'saved'
						)
						.subscribe(
							res => {
								this.getSavedStudents();
								this.googleAnalyticsEventsService.emitEvent(
									'Public',
									'Form Submition',
									'Recruiter Search Form',
									28100
								);
								console.log(res);
							},
							error => {
								console.log(error);
							}
						)
				},
				err => {
					console.error('SA.recruiter.search.component - postStudentSearch', err);
				}
			);
	}

	isSavingStudent(sid: string) {
		return this.savingStudentId === sid;
	}

	inSavedList(sid: string) {
		let response = false;
		if (this.savedStudentsList.length > 0) {
			response = this.savedStudentsList.find(
				s => s.user_id && s.user_id._id === sid
			)
				? true
				: false;
		}
		return response;
	}

	shareStudent(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 ShareModalComponent, 
								 { size: 'lg' }
							 );

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => { }, reason => { });
	}

	pageChange($event: any) {
		this.paginate.emit($event);
	}

	modalProfile(student_id: string) {
		let viewProfileLog: StudentProfileInteraction = {
			student_id: student_id,
			searcher_id: this.recruiter._id,
			actions: {
				viewed: 1
			}
		}

		this.recruiterService
			.recruiterViewedProfile(
				viewProfileLog, 
				'viewed'
			)
			.subscribe(
				res => {
					console.log(res);
				},
				error => {
					console.log(error);
				}
			)

		const modalRef = this.modalService
							 .open(
								 StudentProfileModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => { }, reason => { });
	}

	logSearchAppearances() {
		const dd = new Date();
		const mm = dd.getMonth() + 1;
		const yyyy = dd.getFullYear();
		let searchLogs: Array<studentSearchLogModel> = [];

		for (const student of this.searchResults) {
			this.searchLog = {
				student_id: student._id,
				searcher_id: this.userService.currentUser._id,
				date: dd,
				period: {
					year: yyyy,
					month: mm,
				},
				criteria: this.searchCriteria,
				result_count: 1
			};
			searchLogs.push(this.searchLog)
		}

		this.studentSLService
			.saveSearchLog(
				searchLogs
			)
			.subscribe(
				(response: any) => {
					this.googleAnalyticsEventsService.emitEvent(
						'Public',
						'Form Submition',
						'Recruiter Search Form',
						28100
					);
				},
				err => {
					console.error('SA.recruiter.search.component - postStudentSearch', err);
				}
			);

	}

}
