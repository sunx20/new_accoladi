import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourcesService } from '../../../services/resources.service';

@Component({
  selector: 'app-add-musical-term',
  templateUrl: './add-musical-term.component.html',
})
export class AddMusicalTermComponent implements OnInit {

  form: FormGroup
  submitAttempted = false;
  saving = false

  constructor(public resourceService: ResourcesService) {

    this.form = new FormGroup({
      term: new FormControl('', Validators.required),
      definition: new FormControl('', Validators.required),
      video_url: new FormControl('', Validators.required),
      publish: new FormControl(true),
    });

  }

  ngOnInit() {
  }

  get formModel() {
    return {
      term: this.form.get('term').value,
      definition: this.form.get('definition').value,
      video_url: this.form.get('video_url').value,
      publish: this.form.get('publish').value,
    };
  }

  submitForm() {
    if (this.submitAttempted) {
      this.saving = true;
      this.resourceService.addMusicalTerm(this.formModel).subscribe((res) => {
        this.saving = false
        this.resetForm()
      })
    }
  }

  resetForm() {
    this.submitAttempted = false
    this.form.reset({ term: '', definition: '', video_url: '', publish: true })
  }
}
