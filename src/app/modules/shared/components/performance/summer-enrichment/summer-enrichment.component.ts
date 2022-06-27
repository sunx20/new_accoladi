import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddSummerEnrichmentModalComponent } from './add-summer-enrichment-modal/add-summer-enrichment-modal.component';
import { UpdateSummerEnrichmentModalComponent } from './update-summer-enrichment-modal/update-summer-enrichment-modal.component';
import { DeleteSummerEnrichmentModalComponent } from './delete-summer-enrichment-modal/delete-summer-enrichment-modal.component';
import { UserModel } from '../../../../shared/shared.module';
import { VideoPlayerModalComponent } from '../../../../../modules/shared/shared.module';
import { UserService } from '../../../../shared/shared.module';
import { SummerEnrichmentService } from '../../../../student/services/summer-enrichment.service';
import { SummerEnrichmentModel } from '../../../../student/models/summer-enrichment.model';

@Component({
	selector: 'app-summer-enrichment',
	templateUrl: './summer-enrichment.component.html'
})

export class SummerEnrichmentComponent implements OnInit {

	@Input() student: UserModel;

	summer_enrichments: SummerEnrichmentModel[] = [];
	studentId: string;
	userType: string;
	
	constructor(
		private modalService: NgbModal,
		private userService: UserService,
		private summerEnrichmentService: SummerEnrichmentService
	) {
		if (this.userService.currentUser.role == 'Student') {
			this.userType = 'student'
		} else if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		}
	}

	ngOnInit() {
		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.summerEnrichmentService.getAllStudentSummerEnrichments(this.userService.currentUser._id).subscribe((response: any) => {
				this.summer_enrichments = response.data.summer_enrichments;
			});
		} else {
			this.studentId = this.student._id;
			this.summer_enrichments = this.student.summer_enrichments;
		}
	}

	addStudentSummerEnrichment() {
		let modalRef = this.modalService.open(
			AddSummerEnrichmentModalComponent,
			{ size: 'lg' }
		);

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.summer_enrichments = user.summer_enrichments;
			},
			reason => { }
		);
	}

	updateStudentSummerEnrichment(seid: string) {
		let modalRef = this.modalService.open(
			UpdateSummerEnrichmentModalComponent,
			{ size: 'lg' }
		);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.seid = seid;

		modalRef.result.then(
			user => {
				this.summer_enrichments = user.summer_enrichments;
			},
			reason => { }
		);
	}

	removeStudentSummerEnrichment(seid: string) {
		let modalRef = this.modalService.open(DeleteSummerEnrichmentModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.seid = seid;

		modalRef.result.then(
			user => {
				this.summer_enrichments = user.summer_enrichments;
			},
			reason => { }
		);
	}

	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.video = video;
	}
}
