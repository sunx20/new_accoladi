import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { RatingService } from '../../services/rate.service';
import { RecruiterService } from '../../../recruiter/services/recruiter.service';

import { StudentProfileInteraction } from '../../../recruiter/models/student-profile-visit';

@Component({
	selector: 'app-student-rate',
	templateUrl: './rate.component.html',
	styleUrls: ['./rate.component.css']
})

export class RateComponent implements OnInit {

	@Input() student_id: string;
	@Input() user_id: string;

	currentRate: FormControl;

	constructor(
		private ratingService: RatingService,
		public recruiterService:RecruiterService
	) {
		this.currentRate = new FormControl(null, Validators.required);
	}

	ngOnInit() {
		this.currentRate.valueChanges.subscribe(val => {
			this.ratingService
				.rateStudent(this.user_id, this.student_id, {
					rating: val
				})
				.subscribe((response: any) => {
					let viewProfileLog: StudentProfileInteraction = {
						student_id: this.student_id,
						searcher_id: this.user_id,
						actions:{
							rated :  true
						}
					}		
					this.recruiterService.recruiterViewedProfile(viewProfileLog,"rated").subscribe(
						res => {
							
							console.log(res);
						},
						error => {
							console.log(error);
						}
					)
				 });
		});

		this.ratingService
			.getRating(this.user_id, this.student_id)
			.subscribe((response: any) => {
				if (
					response &&
					response.status === 'success' &&
					response.data
				) {
					this.currentRate.setValue(response.data.rating);
				}
			});
	}
	
}
