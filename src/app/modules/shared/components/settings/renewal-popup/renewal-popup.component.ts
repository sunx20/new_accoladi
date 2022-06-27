import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-renewal-popup',
  templateUrl: './renewal-popup.component.html',
})
export class RenewalPopupComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }
	@Input() data: any;
  ngOnInit() {
  }

  cancelSubscription(event){
    let obj:any;
    if(event=="skip"){
      obj=event
    }else{
    
      obj={'sub_id':this.data.id,'student_id':this.data.student_id,'event':event}
    }
    this.activeModal.close(obj);
  }

}
