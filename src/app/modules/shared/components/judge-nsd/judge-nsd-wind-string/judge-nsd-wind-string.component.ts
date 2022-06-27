import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SigningDayService } from '../../../../student/services/signing-day.service';

@Component({
  selector: 'app-judge-nsd-wind-string',
  templateUrl: './judge-nsd-wind-string.component.html',
  styleUrls: ['./judge-nsd-wind-string.component.css']
})
export class JudgeNsdWindStringComponent implements OnInit {
  @Input() student_id: string;
  @Input() student_name: string;
  @Input() year: string;
  @Input() dataItem: any;
  constructor(private userService: UserService,public activeModal: NgbActiveModal,private sdService: SigningDayService,) { }


  profileForm = new FormGroup({
    PreparedPieceI_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Correctness: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Correctness: new FormControl(''),

    PreparedPieceI_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Rhythm: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Rhythm: new FormControl(''),

    PreparedPieceI_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Tempo: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Tempo: new FormControl(''),

    PreparedPieceI_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Dynamics: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Dynamics: new FormControl(''),

    PreparedPieceI_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Articulation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Articulation: new FormControl(''),

    PreparedPieceI_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Phrasing: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Phrasing: new FormControl(''),

    PreparedPieceI_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Intonation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Intonation: new FormControl(''),

    PreparedPieceI_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Interpretation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Interpretation: new FormControl(''),

    PreparedPieceI_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Presentation: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Presentation: new FormControl(''),

    PreparedPieceI_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    PreparedPieceII_Memorization: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    GeneralComments_Memorization: new FormControl(''),

    Total_PreparedPieceI: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_PreparedPieceII: new FormControl('0', [Validators.min(0), Validators.max(10)]),
    Total_GeneralComments: new FormControl(''),


  });
  SongI: string;
  SongII: string;
  ngOnInit() {
    this.SongI = this.dataItem.performances[0].composition_title
    this.SongII = this.dataItem.performances[1].composition_title
  
  }

  judgesScore:any
  onPreparedPieceIChange(event){
    let firstTotoal =
    Number(this.profileForm.value.PreparedPieceI_Correctness) +
    Number(this.profileForm.value.PreparedPieceI_Rhythm) +
    Number(this.profileForm.value.PreparedPieceI_Tempo) +
    Number(this.profileForm.value.PreparedPieceI_Dynamics) +
    Number(this.profileForm.value.PreparedPieceI_Articulation) +
    Number(this.profileForm.value.PreparedPieceI_Phrasing) +
    Number(this.profileForm.value.PreparedPieceI_Intonation) +
    Number(this.profileForm.value.PreparedPieceI_Interpretation) +
    Number(this.profileForm.value.PreparedPieceI_Presentation) +
    Number(this.profileForm.value.PreparedPieceI_Memorization)

  this.profileForm.get("Total_PreparedPieceI").setValue(firstTotoal);

  this.judgesScore = Number(this.profileForm.value.Total_PreparedPieceI) +
    Number(this.profileForm.value.Total_PreparedPieceII)
  
  }

  onPreparedPieceIIChange(event){
    let secondTotoal =
    Number(this.profileForm.value.PreparedPieceII_Correctness) +
    Number(this.profileForm.value.PreparedPieceII_Rhythm) +
    Number(this.profileForm.value.PreparedPieceII_Tempo) +
    Number(this.profileForm.value.PreparedPieceII_Dynamics) +
    Number(this.profileForm.value.PreparedPieceII_Articulation) +
    Number(this.profileForm.value.PreparedPieceII_Phrasing) +
    Number(this.profileForm.value.PreparedPieceII_Intonation) +
    Number(this.profileForm.value.PreparedPieceII_Interpretation) +
    Number(this.profileForm.value.PreparedPieceII_Presentation) +
    Number(this.profileForm.value.PreparedPieceII_Memorization)

  this.profileForm.get("Total_PreparedPieceII").setValue(secondTotoal);

  this.judgesScore = Number(this.profileForm.value.Total_PreparedPieceI) +
    Number(this.profileForm.value.Total_PreparedPieceII)
  
  }


  sumbit() {

    let songIScoreList = [
    Number(this.profileForm.value.PreparedPieceI_Correctness),
    Number(this.profileForm.value.PreparedPieceI_Rhythm),
    Number(this.profileForm.value.PreparedPieceI_Tempo),
    Number(this.profileForm.value.PreparedPieceI_Dynamics),
    Number(this.profileForm.value.PreparedPieceI_Articulation),
    Number(this.profileForm.value.PreparedPieceI_Phrasing),
    Number(this.profileForm.value.PreparedPieceI_Intonation),
    Number(this.profileForm.value.PreparedPieceI_Interpretation),
    Number(this.profileForm.value.PreparedPieceI_Presentation),
    Number(this.profileForm.value.PreparedPieceI_Memorization)];

    let songIIScoreList =[
      Number(this.profileForm.value.PreparedPieceII_Correctness),
      Number(this.profileForm.value.PreparedPieceII_Rhythm),
      Number(this.profileForm.value.PreparedPieceII_Tempo),
      Number(this.profileForm.value.PreparedPieceII_Dynamics),
      Number(this.profileForm.value.PreparedPieceII_Articulation),
      Number(this.profileForm.value.PreparedPieceII_Phrasing),
      Number(this.profileForm.value.PreparedPieceII_Intonation),
      Number(this.profileForm.value.PreparedPieceII_Interpretation),
      Number(this.profileForm.value.PreparedPieceII_Presentation),
      Number(this.profileForm.value.PreparedPieceII_Memorization)];




    let commentsList = [
    this.profileForm.value.GeneralComments_Correctness,
    this.profileForm.value.GeneralComments_Rhythm,
    this.profileForm.value.GeneralComments_Tempo,
    this.profileForm.value.GeneralComments_Dynamics,
    this.profileForm.value.GeneralComments_Articulation,
    this.profileForm.value.GeneralComments_Phrasing,
    this.profileForm.value.GeneralComments_Intonation,
    this.profileForm.value.GeneralComments_Interpretation,
    this.profileForm.value.GeneralComments_Presentation,
    this.profileForm.value.GeneralComments_Memorization,
    this.profileForm.value.Total_GeneralComments];

   let dateNow = new Date();

    let result = {
      student_id: this.student_id,
      judge_id: this.userService.currentUser._id,
      form: 'performance_Wind/String',
      scores: [songIScoreList,songIIScoreList],
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
