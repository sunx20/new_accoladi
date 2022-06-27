import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parent-wizard',
  templateUrl: './parent-wizard.component.html',
  styleUrls: ['./parent-wizard.component.css']
})
export class ParentWizardComponent implements OnInit {
  public isDateProfile: boolean = false;
  public isAddressProfile: boolean = false;
  public isSchoolProfile: boolean = false;
  public isTalentProfile: boolean = false;
  public isCollegePrefProfile: boolean = false;
  public isParentProfile: boolean = false;
  public isEnsembleProfile: boolean = false;
  public isWizardOpen: boolean = false;
  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.isAddressProfile = true;
  }

  profileOpen(event) {
    if (event.action == "openDate") {
      this.isDateProfile = true;
      this.isAddressProfile = false;
      this.isParentProfile = false;
    }
    if (event.action == "openAddress") {
      this.isWizardOpen = true;
      this.isAddressProfile = true;
      this.isDateProfile = false;
    }
    if (event.action == "openSchool" && event.value == "fromCollegePref") {
      this.isWizardOpen = false;
      this.isSchoolProfile = true;
      this.isAddressProfile = false;
      this.isTalentProfile = false;
      this.isCollegePrefProfile = false;
    }
    if (event.action == "openSchool" && !event.value) {
      this.isWizardOpen = true;
      this.isSchoolProfile = true;
      this.isAddressProfile = false;
      this.isTalentProfile = false;
      this.isCollegePrefProfile = false;
    }
    if (event.action == "openTalent") {
      this.isTalentProfile = true;
      this.isAddressProfile = false;
      this.isSchoolProfile = false;
      this.isParentProfile = false;
    }
    if (event.action == "openCollegePref" && !event.value) {
      this.isCollegePrefProfile = true;
      this.isAddressProfile = false;
      this.isSchoolProfile = false;
      this.isEnsembleProfile = false;
    }
    if (event.action == "openCollegePref" && event.value == "fromEnsemble") {
      this.isWizardOpen = false;
      this.isCollegePrefProfile = true;
      this.isAddressProfile = false;
      this.isSchoolProfile = false;
      this.isEnsembleProfile = false;
    }
    if (event.action == "openParent") {
      this.isParentProfile = true;
      this.isDateProfile = false;
      this.isAddressProfile = false;
      this.isTalentProfile = false;
    }
    if (event.action == "openEnsemble") {
      this.isEnsembleProfile = true;
      this.isAddressProfile = false;
      this.isCollegePrefProfile = false;
    }

  }
}
