import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../../student/services/student.service';
import { UserModel } from '../../../models/user.model';
import { InviteModel } from '../../../models/invite.model';
import { InviteService } from '../../../services/invite.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-parent-profile',
  templateUrl: './parent-profile.component.html',
  styleUrls: ['./parent-profile.component.css']
})
export class ParentProfileComponent implements OnInit {
  student_id: string;
  messageTypes: any[];
  student = new UserModel({});
  model = new InviteModel({});
  form: FormGroup;
  submitAttempted = false;
  pretypedMessage = '';
  loading = false;
  requestFailed = false;
  requestSuccess = false;
  feedback = '';
  @Output() openProfile = new EventEmitter();

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private studentService: StudentService,
    private inviteService: InviteService,
    public activeModal: NgbActiveModal,
    private router: Router
  ) {
    this.form = new FormGroup({
      type: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      additionalMsg: new FormControl('')
    });

    this.messageTypes = [
      {
        type: 'Friend',
        display: 'Invite someone learn about Accoladi.com',
        message: `
Join me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

I think you might like to use Accoladi.com, too. Tell them I referred you!`
      },
      {
        type: 'Parent',
        display:
          'Invite a Parent to see your Accoladi.com account',
        message: `
Join me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

You are my parent and I could use your help with all the information that is available, please sign-up and help me in my quest for the best fine arts scholarships available. Click here to join or accept my invitation Accoladi.com`
      },
      {
        type: 'Teacher',
        display: 'Invite a Teacher',
        message: `
Follow me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

You are my teacher and I could use your help with all the information that is available, please sign-up and help me in my quest for the best fine arts scholarships available. Click here to join or accept my invitation Accoladi.com`
      },
      {
        type: 'Sponsor',
        display:
          'Invite someone to sponsor your journey with Accoladi.com',
        message: `
Join me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

I am well on my way to pursuing a scholarship, but I could use some help with the resources provided by Accoladi.com, would you consider sponsoring my membership? you can read more about it here at Accoladi.com`
      }
    ];
  }

  get formDisabled() {
    return this.loading === true;
  }

  get formModel() {
    return {
      type: this.form.get('type').value,
      email: this.form.get('email').value,
      additionalMsg: this.form.get('additionalMsg').value
    };
  }

  ngOnInit() {
    this.student_id = this.userService.currentUser._id;
    this.getMyProfile();
    this.respondToMessageTypeChange();
  }

  respondToMessageTypeChange() {
    this.form.get('type').valueChanges.subscribe(val => {
      this.pretypedMessage = this.messageTypes
        .filter(m => m.type == val)
        .map(m => m.message)
        .pop();
    });
  }

  getMyProfile() {
    this.studentService.getStudentById(this.student_id).subscribe(
      (response: any) => {
        this.student = response.data;
      },
      err => {
        console.error('SA.invite.invite.sponsor.component - getUser', err);
      }
    );
  }

  resetForm() {
    this.form.reset();
    this.submitAttempted = false;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldInvalid(field),
      'has-feedback': this.isFieldInvalid(field)
    };
  }

  get f() {
		return this.form.controls;
	}

  submitForm() {
    if (!this.loading) {
      this.loading = true;
      this.submitAttempted = true;
      this.requestFailed = this.requestSuccess = false;

      if (this.form.valid) {
        this.inviteService
          .sendInvitation(this.student, new InviteModel(this.formModel))
          .subscribe(
            (response: any) => {
              this.feedback = response.message;
              this.form.reset();
              this.requestSuccess = true;

              setTimeout(() => {
                this.resetForm();
                this.loading = false;
              }, 2000);
            },
            err => {
              console.error('SA.invite.invite.sponsor.component - sendInvitation', err);
              this.loading = false;
              this.feedback = 'Failed to send invitation';
              this.requestFailed = true;
            }
          );
      } else {
        this.validateAllFormFields(this.form);
        this.loading = false;
        this.submitAttempted = false;
      }

    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldInvalid(fieldName: string) {
    const field = this.form.get(fieldName);
    return field.invalid && (field.touched || this.submitAttempted);
  }

  close() {
    this.activeModal.dismiss('Cross click');
  }

  submitAndNext() {
    this.openProfile.emit({ action: "openTalent" });
  }

  BackToPreviousProfile() {
    this.openProfile.emit({ action: "openDate" });
  }

}

