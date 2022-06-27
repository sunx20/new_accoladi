import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnterConversationModalComponent, UserModel, NgbdSortableHeader, SortEvent } from '../../../modules/shared/shared.module';
import { RecruiterService } from '../services/recruiter.service';
import { SavedStudentsService } from '../services/saved-students.service';

@Component({
	selector: 'app-letters',
	templateUrl: './letters.component.html'
})

export class Letters implements OnInit {

	@ViewChildren(NgbdSortableHeader)

	headers: QueryList<NgbdSortableHeader>;
	recruiter = new UserModel({});
	intoLetterList: any[];
	refLetterList: any[];
	removingStudentId = '';
	pageILL: number;
	pageSizeILL: number;
	pageRLL: number;
	pageSizeRLL: number;

	constructor(
		private recruiterService: RecruiterService,
		public recruiterSSTService: SavedStudentsService,
		private modalService: NgbModal
	) {}

	ngOnInit() {
		this.intoLetterList = [];
		this.refLetterList = [];

		this.pageILL = 1;
		this.pageSizeILL = 10;

		this.pageRLL = 1;
		this.pageSizeRLL = 10;

		this.getMyProfile();
	}

	getMyProfile() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
					this.getStudentsWithIntroductionLetters();
					this.getStudentsWithReferenceLetters();
				},
				err => {
					console.error(err);
				}
			);
	}

	getStudentsWithIntroductionLetters() {
		this.recruiterService
			.getStudentsWithIntroductionLetters(
				this.recruiter._id, 
				5
			)
			.subscribe(
				(response: any) => {
					this.intoLetterList = response.data.map((student: any) => {
						return {
							...student,
							events: Array.from(
								new Set(student.honors.map(h => h.event))
							)
						};
					});
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getStudentsWithIntroductionLetters', err );
				}
			);
	}

	getStudentsWithReferenceLetters() {
		this.recruiterService
			.getStudentsWithReferenceLetters(
				this.recruiter._id, 
				5
			)
			.subscribe(
				(response: any) => {
					this.refLetterList = response.data.map((student: any) => {
						return {
							...student,
							events: Array.from(
								new Set(student.honors.map(h => h.event))
							)
						};
					});
				},
				err => {
					console.error( 'SA.recruiter.dashboard.component - getStudentsWithReferenceLetters', err );
				}
			);
	}

	removeSaved(student_id: string) {
		this.removingStudentId = student_id;
		this.recruiterSSTService
			.removeStudentFromSaved(
				student_id
			)
			.subscribe(
				(response: any) => {
					this.getStudentsWithIntroductionLetters();
				},
				err => {
					console.error(err);
				}
			);
	}

	isRemovingStudent(sid: string) {
		return this.removingStudentId == sid;
	}

	sendMessage(recipient_id: string) {
		// this.router.navigate(['/messages', student_id]);
		let modalRef = this.modalService
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

	pageChangeILL($event: any) {
		this.getStudentsWithIntroductionLetters();
	}

	onSortILL({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.intoLetterList.sort((a, b) => {
			return direction === 'asc'
				? a[column] > b[column]
					? 1
					: -1
				: a[column] > b[column]
				? -1
				: 1;
		});
	}

	pageChangeRLL($event: any) {
		this.getStudentsWithIntroductionLetters();
	}

	onSortRLL({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.refLetterList.sort((a, b) => {
			return direction === 'asc'
				? a[column] > b[column]
					? 1
					: -1
				: a[column] > b[column]
				? -1
				: 1;
		});
	}
	
}
