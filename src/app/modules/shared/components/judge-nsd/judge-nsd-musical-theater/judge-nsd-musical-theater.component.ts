import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { SigningDayService } from '../../../../student/services/signing-day.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-judge-nsd-musical-theater',
  templateUrl: './judge-nsd-musical-theater.component.html',
  styleUrls: ['./judge-nsd-musical-theater.component.css']
})
export class JudgeNsdMusicalTheaterComponent implements OnInit {
  @Input() student_id: string;
  @Input() student_name: string;
  @Input() year: string;
  @Input() dataItem: any;
  constructor(private userService: UserService, private sdService: SigningDayService,public activeModal: NgbActiveModal) { }

  profileForm = new FormGroup({
    MonologueI_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_BreathSupport: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_BreathSupport: new FormControl(''),

    MonologueI_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Pronunciation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Pronunciation: new FormControl(''),

    MonologueI_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Intonation: new FormControl(''),

    MonologueI_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Rhythm: new FormControl(''),

    MonologueI_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Tempo: new FormControl(''),

    MonologueI_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Dynamics: new FormControl(''),

    MonologueI_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Phrasing: new FormControl(''),

    MonologueI_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Interpretation: new FormControl(''),

    MonologueI_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Presentation: new FormControl(''),

    MonologueI_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongI_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    SongII_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceI_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    DanceII_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Memorization: new FormControl(''),

    Total_MonologueI: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_SongI: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_SongII: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_DanceI: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_DanceII: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_GeneralComments: new FormControl(''),


  });



  ngOnInit() {
  }
  judgesScore: any;
  onMonologueIChange(event) {

    let firstTotoal =
      Number(this.profileForm.value.MonologueI_BreathSupport) +
      Number(this.profileForm.value.MonologueI_Pronunciation) +
      Number(this.profileForm.value.MonologueI_Intonation) +
      Number(this.profileForm.value.MonologueI_Rhythm) +
      Number(this.profileForm.value.MonologueI_Tempo) +
      Number(this.profileForm.value.MonologueI_Dynamics) +
      Number(this.profileForm.value.MonologueI_Phrasing) +
      Number(this.profileForm.value.MonologueI_Interpretation) +
      Number(this.profileForm.value.MonologueI_Presentation) +
      Number(this.profileForm.value.MonologueI_Memorization)

    this.profileForm.get("Total_MonologueI").setValue(firstTotoal);

    this.judgesScore =
      Number(this.profileForm.value.Total_MonologueI) +
      Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_DanceI) +
      Number(this.profileForm.value.Total_DanceII)

  }

  onSongIChange(event) {

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

    this.judgesScore =
      Number(this.profileForm.value.Total_MonologueI) +
      Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_DanceI) +
      Number(this.profileForm.value.Total_DanceII)

  }

  onSongIIChange(event) {

    let firstTotoal =
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

    this.profileForm.get("Total_SongII").setValue(firstTotoal);

    this.judgesScore =
      Number(this.profileForm.value.Total_MonologueI) +
      Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_DanceI) +
      Number(this.profileForm.value.Total_DanceII)

  }

  onDanceIChange(event) {

    let firstTotoal =
      Number(this.profileForm.value.DanceI_BreathSupport) +
      Number(this.profileForm.value.DanceI_Pronunciation) +
      Number(this.profileForm.value.DanceI_Intonation) +
      Number(this.profileForm.value.DanceI_Rhythm) +
      Number(this.profileForm.value.DanceI_Tempo) +
      Number(this.profileForm.value.DanceI_Dynamics) +
      Number(this.profileForm.value.DanceI_Phrasing) +
      Number(this.profileForm.value.DanceI_Interpretation) +
      Number(this.profileForm.value.DanceI_Presentation) +
      Number(this.profileForm.value.DanceI_Memorization)

    this.profileForm.get("Total_DanceI").setValue(firstTotoal);

    this.judgesScore =
      Number(this.profileForm.value.Total_MonologueI) +
      Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_DanceI) +
      Number(this.profileForm.value.Total_DanceII)

  }

  onDanceIIChange(event) {
    let firstTotoal =
      Number(this.profileForm.value.DanceII_BreathSupport) +
      Number(this.profileForm.value.DanceII_Pronunciation) +
      Number(this.profileForm.value.DanceII_Intonation) +
      Number(this.profileForm.value.DanceII_Rhythm) +
      Number(this.profileForm.value.DanceII_Tempo) +
      Number(this.profileForm.value.DanceII_Dynamics) +
      Number(this.profileForm.value.DanceII_Phrasing) +
      Number(this.profileForm.value.DanceII_Interpretation) +
      Number(this.profileForm.value.DanceII_Presentation) +
      Number(this.profileForm.value.DanceII_Memorization)

    this.profileForm.get("Total_DanceII").setValue(firstTotoal);

    this.judgesScore =
      Number(this.profileForm.value.Total_MonologueI) +
      Number(this.profileForm.value.Total_SongI) +
      Number(this.profileForm.value.Total_SongII) +
      Number(this.profileForm.value.Total_DanceI) +
      Number(this.profileForm.value.Total_DanceII)

  }

  sumbit() {
    let MonologueIScoreList = [
      Number(this.profileForm.value.MonologueI_BreathSupport),
      Number(this.profileForm.value.MonologueI_Pronunciation),
      Number(this.profileForm.value.MonologueI_Intonation),
      Number(this.profileForm.value.MonologueI_Rhythm),
      Number(this.profileForm.value.MonologueI_Tempo),
      Number(this.profileForm.value.MonologueI_Dynamics),
      Number(this.profileForm.value.MonologueI_Phrasing),
      Number(this.profileForm.value.MonologueI_Interpretation),
      Number(this.profileForm.value.MonologueI_Presentation),
      Number(this.profileForm.value.MonologueI_Memorization)];

    let SongIScoreList = [
      Number(this.profileForm.value.SongI_BreathSupport),
      Number(this.profileForm.value.SongI_Pronunciation),
      Number(this.profileForm.value.SongI_Intonation),
      Number(this.profileForm.value.SongI_Rhythm),
      Number(this.profileForm.value.SongI_Tempo),
      Number(this.profileForm.value.SongI_Dynamics),
      Number(this.profileForm.value.SongI_Phrasing),
      Number(this.profileForm.value.SongI_Interpretation),
      Number(this.profileForm.value.SongI_Presentation),
      Number(this.profileForm.value.SongI_Memorization)];


    let SongIIScoreList = [
      Number(this.profileForm.value.SongII_BreathSupport),
      Number(this.profileForm.value.SongII_Pronunciation),
      Number(this.profileForm.value.SongII_Intonation),
      Number(this.profileForm.value.SongII_Rhythm),
      Number(this.profileForm.value.SongII_Tempo),
      Number(this.profileForm.value.SongII_Dynamics),
      Number(this.profileForm.value.SongII_Phrasing),
      Number(this.profileForm.value.SongII_Interpretation),
      Number(this.profileForm.value.SongII_Presentation),
      Number(this.profileForm.value.SongII_Memorization)];

    let DanceIScoreList = [
      Number(this.profileForm.value.DanceI_BreathSupport),
      Number(this.profileForm.value.DanceI_Pronunciation),
      Number(this.profileForm.value.DanceI_Intonation),
      Number(this.profileForm.value.DanceI_Rhythm),
      Number(this.profileForm.value.DanceI_Tempo),
      Number(this.profileForm.value.DanceI_Dynamics),
      Number(this.profileForm.value.DanceI_Phrasing),
      Number(this.profileForm.value.DanceI_Interpretation),
      Number(this.profileForm.value.DanceI_Presentation),
      Number(this.profileForm.value.DanceI_Memorization)];

    let DanceIIScoreList = [
      Number(this.profileForm.value.DanceII_BreathSupport),
      Number(this.profileForm.value.DanceII_Pronunciation),
      Number(this.profileForm.value.DanceII_Intonation),
      Number(this.profileForm.value.DanceII_Rhythm),
      Number(this.profileForm.value.DanceII_Tempo),
      Number(this.profileForm.value.DanceII_Dynamics),
      Number(this.profileForm.value.DanceII_Phrasing),
      Number(this.profileForm.value.DanceII_Interpretation),
      Number(this.profileForm.value.DanceII_Presentation),
      Number(this.profileForm.value.DanceII_Memorization)];




    let commentsList = [
      this.profileForm.value.GeneralComments_BreathSupport,
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
      form: 'Production_Musical Theater',
      scores: [MonologueIScoreList, SongIScoreList,SongIIScoreList,DanceIScoreList,DanceIIScoreList],
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

  close() {
    this.activeModal.close();
  }

}
