import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SigningDayService } from '../../../../student/services/signing-day.service';

@Component({
  selector: 'app-judge-nsd-voice',
  templateUrl: './judge-nsd-voice.component.html',
  styleUrls: ['./judge-nsd-voice.component.css']
})
export class JudgeNsdVoiceComponent implements OnInit {
  @Input() student_id: string;
  @Input() student_name: string;
  @Input() year: string;
  @Input() dataItem: any;
  constructor(private userService: UserService,  private sdService: SigningDayService,	public activeModal: NgbActiveModal) { }
  profileForm = new FormGroup({
    SongI_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_BreathSupport: new FormControl(''),

    SongI_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Pronunciation: new FormControl(''),

    SongI_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Intonation: new FormControl(''),

    SongI_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Rhythm: new FormControl(''),

    SongI_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Tempo: new FormControl(''),

    SongI_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Dynamics: new FormControl(''),

    SongI_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Phrasing: new FormControl(''),

    SongI_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Interpretation: new FormControl(''),

    SongI_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Presentation: new FormControl(''),

    SongI_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongIII_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Memorization: new FormControl(''),

    Total_SongI: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_SongII: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_SongIII: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_GeneralComments: new FormControl(''),


  });
  SongI: string;
  SongII: string;
  SongIII: string;
  ngOnInit() {
    this.SongI = this.dataItem.performances[0].composition_title
    this.SongII = this.dataItem.performances[1].composition_title
    this.SongIII = this.dataItem.performances[2].composition_title
   
  }
  onSongOneChange(event) {

    let firstTotoal =
      Number(this.profileForm.value.SongI_BreathSupport) +
      Number(this.profileForm.value.SongI_Pronunciation) +
      Number(this.profileForm.value.SongI_Intonation) +
      Number(this.profileForm.value.SongI_Rhythm) +
      Number(this.profileForm.value.SongI_Tempo) +
      Number(this.profileForm.value.SongI_Dynamics) +
      Number(this.profileForm.value.SongI_Phrasing) +
      Number(this.profileForm.value.SongI_Interpretation) +
      Number(this.profileForm.value.SongI_Presentation) +
      Number(this.profileForm.value.SongI_Memorization)

    this.profileForm.get("Total_SongI").setValue(firstTotoal);

    this.judgesScore = Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_SongIII)
  }

  onSongTwoChange(event) {

    let totoal =
      Number(this.profileForm.value.SongII_BreathSupport) +
      Number(this.profileForm.value.SongII_Pronunciation) +
      Number(this.profileForm.value.SongII_Intonation) +
      Number(this.profileForm.value.SongII_Rhythm) +
      Number(this.profileForm.value.SongII_Tempo) +
      Number(this.profileForm.value.SongII_Dynamics) +
      Number(this.profileForm.value.SongII_Phrasing) +
      Number(this.profileForm.value.SongII_Interpretation) +
      Number(this.profileForm.value.SongII_Presentation) +
      Number(this.profileForm.value.SongII_Memorization)

    this.profileForm.get("Total_SongII").setValue(totoal);

    this.judgesScore = Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_SongIII)
  }
  judgesScore: any;
  onSongThreeChange(event) {

    let totoal =
      Number(this.profileForm.value.SongIII_BreathSupport) +
      Number(this.profileForm.value.SongIII_Pronunciation) +
      Number(this.profileForm.value.SongIII_Intonation) +
      Number(this.profileForm.value.SongIII_Rhythm) +
      Number(this.profileForm.value.SongIII_Tempo) +
      Number(this.profileForm.value.SongIII_Dynamics) +
      Number(this.profileForm.value.SongIII_Phrasing) +
      Number(this.profileForm.value.SongIII_Interpretation) +
      Number(this.profileForm.value.SongIII_Presentation) +
      Number(this.profileForm.value.SongIII_Memorization)

    this.profileForm.get("Total_SongIII").setValue(totoal);

    this.judgesScore = Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_SongIII)
  }

  sumbit() {

    let songIScoreList = [Number(this.profileForm.value.SongI_BreathSupport),
    Number(this.profileForm.value.SongI_Pronunciation),
    Number(this.profileForm.value.SongI_Intonation),
    Number(this.profileForm.value.SongI_Rhythm),
    Number(this.profileForm.value.SongI_Tempo),
    Number(this.profileForm.value.SongI_Dynamics),
    Number(this.profileForm.value.SongI_Phrasing),
    Number(this.profileForm.value.SongI_Interpretation),
    Number(this.profileForm.value.SongI_Presentation),
    Number(this.profileForm.value.SongI_Memorization)];

    let songIIScoreList = [Number(this.profileForm.value.SongII_BreathSupport),
    Number(this.profileForm.value.SongII_Pronunciation),
    Number(this.profileForm.value.SongII_Intonation),
    Number(this.profileForm.value.SongII_Rhythm),
    Number(this.profileForm.value.SongII_Tempo),
    Number(this.profileForm.value.SongII_Dynamics),
    Number(this.profileForm.value.SongII_Phrasing),
    Number(this.profileForm.value.SongII_Interpretation),
    Number(this.profileForm.value.SongII_Presentation),
    Number(this.profileForm.value.SongII_Memorization)];

    let songIIIScoreList = [Number(this.profileForm.value.SongIII_BreathSupport),
    Number(this.profileForm.value.SongIII_Pronunciation),
    Number(this.profileForm.value.SongIII_Intonation),
    Number(this.profileForm.value.SongIII_Rhythm),
    Number(this.profileForm.value.SongIII_Tempo),
    Number(this.profileForm.value.SongIII_Dynamics),
    Number(this.profileForm.value.SongIII_Phrasing),
    Number(this.profileForm.value.SongIII_Interpretation),
    Number(this.profileForm.value.SongIII_Presentation),
    Number(this.profileForm.value.SongIII_Memorization)];


    let commentsList = [this.profileForm.value.GeneralComments_BreathSupport,
    this.profileForm.value.GeneralComments_Pronunciation,
    this.profileForm.value.GeneralComments_Intonation,
    this.profileForm.value.GeneralComments_Rhythm,
    this.profileForm.value.GeneralComments_Tempo,
    this.profileForm.value.GeneralComments_Dynamics,
    this.profileForm.value.GeneralComments_Phrasing,
    this.profileForm.value.GeneralComments_Interpretation,
    this.profileForm.value.GeneralComments_Presentation,
    this.profileForm.value.GeneralComments_Memorization,
    this.profileForm.value.Total_GeneralComments];

   let dateNow = new Date();

    let result = {
      student_id: this.student_id,
      judge_id: this.userService.currentUser._id,
      form: 'performance_vocal',
      scores:[songIScoreList,songIIScoreList,songIIIScoreList],
      // scores: [
      //   { id: this.dataItem.performances[0]._id, scoreList: songIScoreList },
      //   { id: this.dataItem.performances[1]._id, scoreList: songIIScoreList },
      //   { id: this.dataItem.performances[2]._id, scoreList: songIIIScoreList }
      // ],
      score: this.judgesScore,
      comments: commentsList,
      date: dateNow,
    }

    console.log(result)


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


  close(){
    this.activeModal.close();
  }

}
