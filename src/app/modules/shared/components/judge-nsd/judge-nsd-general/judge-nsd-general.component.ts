import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../services/user.service';
import { SigningDayService } from '../../../../student/services/signing-day.service';

@Component({
	selector: 'app-judge-nsd-general',
	templateUrl: './judge-nsd-general.component.html',
	styleUrls: ['./judge-nsd-general.component.css']
})
export class JudgeNsdGeneralComponent implements OnInit {

	@Input() student_id: string;
	@Input() student_name: string;
	@Input() year: string;
	@Input() dataItem: any;
	composition1: string;
	composition2: string;
	composition3: string;
	composition4: string;
	composition5: string;
	judgesScore: number = 0;

	constructor(
		private userService: UserService, 
		private sdService: SigningDayService, 
		public activeModal: NgbActiveModal
	) { }
	
	profileForm = new FormGroup({
		Composition1_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Correctness: new FormControl(''),

		Composition1_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Rhythm: new FormControl(''),

		Composition1_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Tempo: new FormControl(''),

		Composition1_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Dynamics: new FormControl(''),

		Composition1_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Articulation: new FormControl(''),

		Composition1_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Phrasing: new FormControl(''),

		Composition1_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Balance: new FormControl(''),

		Composition1_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Interpretation: new FormControl(''),

		Composition1_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Presentation: new FormControl(''),

		Composition1_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition2_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition3_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition4_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Composition5_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		GeneralComments_Memorization: new FormControl(''),

		Total_Composition1: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Total_Composition2: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Total_Composition3: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Total_Composition4: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Total_Composition5: new FormControl('0', [Validators.min(0), Validators.max(10)]),
		Total_GeneralComments: new FormControl(''),
	});

	ngOnInit() { console.log( 'general judge data item...', this.dataItem);
		this.composition1 = ( this.dataItem.audition[0] ? this.dataItem.audition[0].performed : '' );
		this.composition2 = ( this.dataItem.audition[1] ? this.dataItem.audition[1].performed : '' );
		this.composition3 = ( this.dataItem.audition[2] ? this.dataItem.audition[2].performed : '' );
		this.composition4 = ( this.dataItem.audition[3] ? this.dataItem.audition[3].performed : '' );
		this.composition5 = ( this.dataItem.audition[4] ? this.dataItem.audition[4].performed : '' );
	}

	onComposition1Change(event) {

		let firstTotoal =
			Number(this.profileForm.value.Composition1_Correctness) +
			Number(this.profileForm.value.Composition1_Rhythm) +
			Number(this.profileForm.value.Composition1_Tempo) +
			Number(this.profileForm.value.Composition1_Dynamics) +
			Number(this.profileForm.value.Composition1_Articulation) +
			Number(this.profileForm.value.Composition1_Phrasing) +
			Number(this.profileForm.value.Composition1_Balance) +
			Number(this.profileForm.value.Composition1_Interpretation) +
			Number(this.profileForm.value.Composition1_Presentation) +
			Number(this.profileForm.value.Composition1_Memorization)

		this.profileForm.get("Total_Composition1").setValue(firstTotoal);

		this.judgesScore =
			Number(this.profileForm.value.Total_Composition1) +
			Number(this.profileForm.value.Total_Composition2) +
			Number(this.profileForm.value.Total_Composition3) +
			Number(this.profileForm.value.Total_Composition4) +
			Number(this.profileForm.value.Total_Composition5)
	}

	onComposition2Change(event) {

		let secondTotoal =
			Number(this.profileForm.value.Composition2_Correctness) +
			Number(this.profileForm.value.Composition2_Rhythm) +
			Number(this.profileForm.value.Composition2_Tempo) +
			Number(this.profileForm.value.Composition2_Dynamics) +
			Number(this.profileForm.value.Composition2_Articulation) +
			Number(this.profileForm.value.Composition2_Phrasing) +
			Number(this.profileForm.value.Composition2_Balance) +
			Number(this.profileForm.value.Composition2_Interpretation) +
			Number(this.profileForm.value.Composition2_Presentation) +
			Number(this.profileForm.value.Composition2_Memorization)

		this.profileForm.get("Total_Composition2").setValue(secondTotoal);

		this.judgesScore =
			Number(this.profileForm.value.Total_Composition1) +
			Number(this.profileForm.value.Total_Composition2) +
			Number(this.profileForm.value.Total_Composition3) +
			Number(this.profileForm.value.Total_Composition4) +
			Number(this.profileForm.value.Total_Composition5)
	}

	onComposition3Change(event) {

		let thirdTotoal =
			Number(this.profileForm.value.Composition3_Correctness) +
			Number(this.profileForm.value.Composition3_Rhythm) +
			Number(this.profileForm.value.Composition3_Tempo) +
			Number(this.profileForm.value.Composition3_Dynamics) +
			Number(this.profileForm.value.Composition3_Articulation) +
			Number(this.profileForm.value.Composition3_Phrasing) +
			Number(this.profileForm.value.Composition3_Balance) +
			Number(this.profileForm.value.Composition3_Interpretation) +
			Number(this.profileForm.value.Composition3_Presentation) +
			Number(this.profileForm.value.Composition3_Memorization)

		this.profileForm.get("Total_Composition3").setValue(thirdTotoal);

		this.judgesScore =
			Number(this.profileForm.value.Total_Composition1) +
			Number(this.profileForm.value.Total_Composition2) +
			Number(this.profileForm.value.Total_Composition3) +
			Number(this.profileForm.value.Total_Composition4) +
			Number(this.profileForm.value.Total_Composition5)
	}

	onComposition4Change(event) {

		let fourthTotoal =
			Number(this.profileForm.value.Composition4_Correctness) +
			Number(this.profileForm.value.Composition4_Rhythm) +
			Number(this.profileForm.value.Composition4_Tempo) +
			Number(this.profileForm.value.Composition4_Dynamics) +
			Number(this.profileForm.value.Composition4_Articulation) +
			Number(this.profileForm.value.Composition4_Phrasing) +
			Number(this.profileForm.value.Composition4_Balance) +
			Number(this.profileForm.value.Composition4_Interpretation) +
			Number(this.profileForm.value.Composition4_Presentation) +
			Number(this.profileForm.value.Composition4_Memorization)

		this.profileForm.get("Total_Composition4").setValue(fourthTotoal);

		this.judgesScore =
			Number(this.profileForm.value.Total_Composition1) +
			Number(this.profileForm.value.Total_Composition2) +
			Number(this.profileForm.value.Total_Composition3) +
			Number(this.profileForm.value.Total_Composition4) +
			Number(this.profileForm.value.Total_Composition5)
	}

	onComposition5Change(event) {

		let fifthTotoal =
			Number(this.profileForm.value.Composition5_Correctness) +
			Number(this.profileForm.value.Composition5_Rhythm) +
			Number(this.profileForm.value.Composition5_Tempo) +
			Number(this.profileForm.value.Composition5_Dynamics) +
			Number(this.profileForm.value.Composition5_Articulation) +
			Number(this.profileForm.value.Composition5_Phrasing) +
			Number(this.profileForm.value.Composition5_Balance) +
			Number(this.profileForm.value.Composition5_Interpretation) +
			Number(this.profileForm.value.Composition5_Presentation) +
			Number(this.profileForm.value.Composition5_Memorization)

		this.profileForm.get("Total_Composition5").setValue(fifthTotoal);

		this.judgesScore =
			Number(this.profileForm.value.Total_Composition1) +
			Number(this.profileForm.value.Total_Composition2) +
			Number(this.profileForm.value.Total_Composition3) +
			Number(this.profileForm.value.Total_Composition4) +
			Number(this.profileForm.value.Total_Composition5)
	}

	sumbit() {
		let composition1ScoreList =
			[
				Number(this.profileForm.value.Composition1_Correctness),
				Number(this.profileForm.value.Composition1_Rhythm),
				Number(this.profileForm.value.Composition1_Tempo),
				Number(this.profileForm.value.Composition1_Dynamics),
				Number(this.profileForm.value.Composition1_Articulation),
				Number(this.profileForm.value.Composition1_Phrasing),
				Number(this.profileForm.value.Composition1_Balance),
				Number(this.profileForm.value.Composition1_Interpretation),
				Number(this.profileForm.value.Composition1_Presentation),
				Number(this.profileForm.value.Composition1_Memorization)
			];

		let composition2ScoreList =
			[
				Number(this.profileForm.value.Composition2_Correctness),
				Number(this.profileForm.value.Composition2_Rhythm),
				Number(this.profileForm.value.Composition2_Tempo),
				Number(this.profileForm.value.Composition2_Dynamics),
				Number(this.profileForm.value.Composition2_Articulation),
				Number(this.profileForm.value.Composition2_Phrasing),
				Number(this.profileForm.value.Composition2_Balance),
				Number(this.profileForm.value.Composition2_Interpretation),
				Number(this.profileForm.value.Composition2_Presentation),
				Number(this.profileForm.value.Composition2_Memorization)
			];

		let composition3ScoreList =
			[
				Number(this.profileForm.value.Composition3_Correctness),
				Number(this.profileForm.value.Composition3_Rhythm),
				Number(this.profileForm.value.Composition3_Tempo),
				Number(this.profileForm.value.Composition3_Dynamics),
				Number(this.profileForm.value.Composition3_Articulation),
				Number(this.profileForm.value.Composition3_Phrasing),
				Number(this.profileForm.value.Composition3_Balance),
				Number(this.profileForm.value.Composition3_Interpretation),
				Number(this.profileForm.value.Composition3_Presentation),
				Number(this.profileForm.value.Composition3_Memorization)
			];

		let composition4ScoreList =
			[
				Number(this.profileForm.value.Composition4_Correctness),
				Number(this.profileForm.value.Composition4_Rhythm),
				Number(this.profileForm.value.Composition4_Tempo),
				Number(this.profileForm.value.Composition4_Dynamics),
				Number(this.profileForm.value.Composition4_Articulation),
				Number(this.profileForm.value.Composition4_Phrasing),
				Number(this.profileForm.value.Composition4_Balance),
				Number(this.profileForm.value.Composition4_Interpretation),
				Number(this.profileForm.value.Composition4_Presentation),
				Number(this.profileForm.value.Composition4_Memorization)
			];

		let composition5ScoreList =
			[
				Number(this.profileForm.value.Composition5_Correctness),
				Number(this.profileForm.value.Composition5_Rhythm),
				Number(this.profileForm.value.Composition5_Tempo),
				Number(this.profileForm.value.Composition5_Dynamics),
				Number(this.profileForm.value.Composition5_Articulation),
				Number(this.profileForm.value.Composition5_Phrasing),
				Number(this.profileForm.value.Composition5_Balance),
				Number(this.profileForm.value.Composition5_Interpretation),
				Number(this.profileForm.value.Composition5_Presentation),
				Number(this.profileForm.value.Composition5_Memorization)
			];

		let commentsList =
			[
				this.profileForm.value.GeneralComments_Correctness,
				this.profileForm.value.GeneralComments_Rhythm,
				this.profileForm.value.GeneralComments_Tempo,
				this.profileForm.value.GeneralComments_Dynamics,
				this.profileForm.value.GeneralComments_Articulation,
				this.profileForm.value.GeneralComments_Phrasing,
				this.profileForm.value.GeneralComments_Balance,
				this.profileForm.value.GeneralComments_Interpretation,
				this.profileForm.value.GeneralComments_Presentation,
				this.profileForm.value.GeneralComments_Memorization,
				this.profileForm.value.Total_GeneralComments
			];

		let dateNow = new Date();

		let result = {
			student_id: this.student_id,
			judge_id: this.userService.currentUser._id,
			form: 'performance_General',
			scores: [
				composition1ScoreList,
				composition2ScoreList,
				composition3ScoreList,
				composition4ScoreList,
				composition5ScoreList
			],
			score: this.judgesScore,
			comments: commentsList,
			date: dateNow,
		}

		this.sdService
			.saveJudgeNsdVoice(result)
			.subscribe(
				(response: any) => {
					this.activeModal.close();
				},
				err => {

				}
			);
	}

	close() {
		this.activeModal.close();
	}

}
