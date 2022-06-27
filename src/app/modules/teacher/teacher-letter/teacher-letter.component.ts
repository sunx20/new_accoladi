import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SendTeacherLetterModalComponent } from './send-teacher-letter-modal/send-teacher-letter-modal.component';
import { TeacherLetterService } from '../services/letter.service';
import { UserModel } from '../../shared/shared.module';

@Component({
	selector: 'app-teacher-letter',
	templateUrl: './teacher-letter.component.html'
})

export class TeacherLetterComponent implements OnInit {
	
	@Input() teacher: UserModel;

	requestLetters: any[];
	referralLetters: any[];
	introductionLetters: any[];

	constructor(
		private modalService: NgbModal,
		private letterService: TeacherLetterService
	) {
		this.requestLetters = this.referralLetters = this.introductionLetters = [];
	}

	ngOnInit() {

		if (this.teacher) {

			this.letterService
				.getTeacherLetters(
					this.teacher._id
				)
				.subscribe(
					(response: any) => {
						this.requestLetters = response.data.filter((l: any) => l.type == 'request');
						this.referralLetters = response.data.filter((l: any) => l.type == 'referral');
						this.introductionLetters = response.data.filter((l: any) => l.type == 'introduction');
					}
				);

		}
	}

	send() {
		const modalRef = this.modalService
							 .open(
								 SendTeacherLetterModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.teacher_id = this.teacher._id;
		modalRef.result
				.then(
					(data) => {
						console.log(data);
					}, 
					(reason) => { }
				);
	}
	
}