import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SigningDayService } from '../../../../student/services/signing-day.service';

@Component({
  selector: 'app-judge-nsd-keyboard',
  templateUrl: './judge-nsd-keyboard.component.html',
  styleUrls: ['./judge-nsd-keyboard.component.css']
})
export class JudgeNsdKeyboardComponent implements OnInit {

  constructor(private userService: UserService, private sdService: SigningDayService, public activeModal: NgbActiveModal) { }
  @Input() student_id: string;
  @Input() student_name: string;
  @Input() year: string;
  @Input() dataItem: any;
  compositionI: string;
  compositionII: string;

  profileForm = new FormGroup({
    CompositionI_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Correctness: new FormControl(''),

    CompositionI_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Rhythm: new FormControl(''),

    CompositionI_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Tempo: new FormControl(''),

    CompositionI_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Dynamics: new FormControl(''),

    CompositionI_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Articulation: new FormControl(''),

    CompositionI_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Phrasing: new FormControl(''),

    CompositionI_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Balance: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Balance: new FormControl(''),

    CompositionI_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Interpretation: new FormControl(''),

    CompositionI_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Presentation: new FormControl(''),

    CompositionI_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    CompositionII_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Memorization: new FormControl(''),

    Total_CompositionI: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_CompositionII: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_GeneralComments: new FormControl(''),


  });

  ngOnInit() {
    this.compositionI = this.dataItem.performances[0].composition_title
    this.compositionII = this.dataItem.performances[1].composition_title
  }

  judgesScore: number = 0;

  onCompositionOneChange(event) {

    let firstTotoal =
      Number(this.profileForm.value.CompositionI_Correctness) +
      Number(this.profileForm.value.CompositionI_Rhythm) +
      Number(this.profileForm.value.CompositionI_Tempo) +
      Number(this.profileForm.value.CompositionI_Dynamics) +
      Number(this.profileForm.value.CompositionI_Articulation) +
      Number(this.profileForm.value.CompositionI_Phrasing) +
      Number(this.profileForm.value.CompositionI_Balance) +
      Number(this.profileForm.value.CompositionI_Interpretation) +
      Number(this.profileForm.value.CompositionI_Presentation) +
      Number(this.profileForm.value.CompositionI_Memorization)

    this.profileForm.get("Total_CompositionI").setValue(firstTotoal);

    this.judgesScore =
      Number(this.profileForm.value.Total_CompositionI) +
      Number(this.profileForm.value.Total_CompositionII)
  }

  onCompositionTwoChange(event) {

    let secondTotoal =
      Number(this.profileForm.value.CompositionII_Correctness) +
      Number(this.profileForm.value.CompositionII_Rhythm) +
      Number(this.profileForm.value.CompositionII_Tempo) +
      Number(this.profileForm.value.CompositionII_Dynamics) +
      Number(this.profileForm.value.CompositionII_Articulation) +
      Number(this.profileForm.value.CompositionII_Phrasing) +
      Number(this.profileForm.value.CompositionII_Balance) +
      Number(this.profileForm.value.CompositionII_Interpretation) +
      Number(this.profileForm.value.CompositionII_Presentation) +
      Number(this.profileForm.value.CompositionII_Memorization)

    this.profileForm.get("Total_CompositionII").setValue(secondTotoal);

    this.judgesScore =
      Number(this.profileForm.value.Total_CompositionI) +
      Number(this.profileForm.value.Total_CompositionII)
  }


  sumbit() {
    let compositionIScoreList =
      [Number(this.profileForm.value.CompositionI_Correctness),
      Number(this.profileForm.value.CompositionI_Rhythm),
      Number(this.profileForm.value.CompositionI_Tempo),
      Number(this.profileForm.value.CompositionI_Dynamics),
      Number(this.profileForm.value.CompositionI_Articulation),
      Number(this.profileForm.value.CompositionI_Phrasing),
      Number(this.profileForm.value.CompositionI_Balance),
      Number(this.profileForm.value.CompositionI_Interpretation),
      Number(this.profileForm.value.CompositionI_Presentation),
      Number(this.profileForm.value.CompositionI_Memorization)];

    let compositionIIScoreList =
      [Number(this.profileForm.value.CompositionII_Correctness),
      Number(this.profileForm.value.CompositionII_Rhythm),
      Number(this.profileForm.value.CompositionII_Tempo),
      Number(this.profileForm.value.CompositionII_Dynamics),
      Number(this.profileForm.value.CompositionII_Articulation),
      Number(this.profileForm.value.CompositionII_Phrasing),
      Number(this.profileForm.value.CompositionII_Balance),
      Number(this.profileForm.value.CompositionII_Interpretation),
      Number(this.profileForm.value.CompositionII_Presentation),
      Number(this.profileForm.value.CompositionII_Memorization)];




    let commentsList =
      [this.profileForm.value.GeneralComments_Correctness,
      this.profileForm.value.GeneralComments_Rhythm,
      this.profileForm.value.GeneralComments_Tempo,
      this.profileForm.value.GeneralComments_Dynamics,
      this.profileForm.value.GeneralComments_Articulation,
      this.profileForm.value.GeneralComments_Phrasing,
      this.profileForm.value.GeneralComments_Balance,
      this.profileForm.value.GeneralComments_Interpretation,
      this.profileForm.value.GeneralComments_Presentation,
      this.profileForm.value.GeneralComments_Memorization,
      this.profileForm.value.Total_GeneralComments];

    let dateNow = new Date();

    let result = {
      student_id: this.student_id,
      judge_id: this.userService.currentUser._id,
      form: 'performance_Keyboard',
      scores: [
        compositionIScoreList, 
        compositionIIScoreList

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
