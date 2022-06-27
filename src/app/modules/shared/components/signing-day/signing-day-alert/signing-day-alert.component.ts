import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signing-day-alert',
  templateUrl: './signing-day-alert.component.html',
  styleUrls: ['./signing-day-alert.component.css']
})
export class SigningDayAlertComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
		this.activeModal.dismiss('Cross click');
	}

}
