import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-music-history-guids',
  templateUrl: './music-history-guids.component.html',
})
export class MusicHistoryGuidsComponent implements OnInit {

  guidesList: Array<any>;
  form: FormGroup;
  loading = false;
  submitAttempted = false;
  searchResults = []
  total = 0;

  constructor(private resourcesService: ResourcesService) {
    this.form = new FormGroup({
      name: new FormControl(''),
      biography: new FormControl(''),
      genres: new FormControl(''),
      composition: new FormControl(''),
    });
  }

  ngOnInit() {
    this.resourcesService.getMusicHistoryGuides().subscribe((res: any) => {
      if (res.data.length > 0) {
        this.guidesList = res.data
        this.searchResults = res.data
      }
    })
  }

  get formModel() {
    return {
      name: this.form.get('name').value,
      biography: this.form.get('biography').value,
      genres: this.form.get('genres').value,
      composition: this.form.get('composition').value,
    };
  }

  resetForm() {

    this.form.reset({
      name: '',
      genres: '',
      composition: '',
      biography: ''
    });

    this.submitAttempted = false;
    this.loading = false;
    this.searchResults = this.guidesList;
  }

  submitForm(loading = true) {

    this.loading = loading;

    if (this.isValidCriteria()) {
      this.searchResults = this.guidesList.filter((item) => this.isElementExists(item))
      this.total = this.searchResults.length
      this.loading = false
      this.submitAttempted = true
    }
    else {
      this.loading = false
    }
  }

  isElementExists(item) {
    return (item.name.toLowerCase().includes(this.formModel.name.toLowerCase())
      && item.biography.toLowerCase().includes(this.formModel.biography.toLowerCase())
      && item.genres.toLowerCase().includes(this.formModel.genres.toLowerCase())
      && this.isCompositionExists(item.examples, this.formModel.composition))
  }

  isValidCriteria(): boolean {
    return this.formModel.name && this.formModel.name != ''
      || this.formModel.biography && this.formModel.biography != ''
      || this.formModel.genres && this.formModel.genres != ''
      || this.formModel.composition && this.formModel.composition != ''
  }

  isCompositionExists(data: any, query): boolean {
    return JSON.stringify(data).toLowerCase().includes(query)
  }
}
