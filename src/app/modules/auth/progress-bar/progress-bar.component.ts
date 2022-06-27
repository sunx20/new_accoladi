import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-progress-bar',
	templateUrl: './progress-bar.component.html',
	//styleUrls: ['./progress-bar.component.css']
})

export class ProgressBarComponent implements OnInit {

	@Input() role: string;
	@Input() wizard: string;
	@Input() type: string;
	
	constructor() { }
	status: '';
	complete = 'is-complete';
	active = 'is-active'
	last = 'progress__last'
	personalInfoStatus = this.last
	accountInfoStatus = this.last
	locationInfoStatus = this.last
	talentInfoStatus = this.last
	schoolInfoStatus = this.last
	parentInfoStatus = this.last
	studentPersonalInfoStatus = this.last
	studentAccountInfoStatus = this.last
	StudentTalentInfoStatus = this.last
	studentSchoolInfoStatus = this.last

	ngOnInit() {
		if (this.role == 'Student') {
			if (this.wizard == 'personal-info') {
				this.personalInfoStatus = this.active
			} else if (this.wizard == 'account-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.active
			} else if (this.wizard == 'location-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.active;
			} else if (this.wizard == 'talent-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.talentInfoStatus = this.active;
			} else if (this.wizard == 'school-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.talentInfoStatus = this.complete;
				this.schoolInfoStatus = this.active;
			} else if (this.wizard == 'parent-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.talentInfoStatus = this.complete;
				this.schoolInfoStatus = this.complete;
				this.parentInfoStatus = this.active;
			}
		} else if (this.role == 'Parent') {
			if (this.wizard == 'personal-info' && this.type == 'Parent') {
				this.personalInfoStatus = this.active
			} else if (this.wizard == 'account-info' && this.type == 'Parent') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.active
			} else if (this.wizard == 'location-info' && this.type == 'Parent') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.active;
			} else if (this.wizard == 'personal-info' && this.type == 'Child') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.studentPersonalInfoStatus = this.active;
			} else if (this.wizard == 'account-info' && this.type == 'Child') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.studentPersonalInfoStatus = this.complete;
				this.studentAccountInfoStatus = this.active;
			} else if (this.wizard == 'talent-info' && this.type == 'Child') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.studentPersonalInfoStatus = this.complete;
				this.studentAccountInfoStatus = this.complete;
				this.StudentTalentInfoStatus = this.active;
			} else if (this.wizard == 'school-info' && this.type == 'Child') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.studentPersonalInfoStatus = this.complete;
				this.studentAccountInfoStatus = this.complete;
				this.StudentTalentInfoStatus = this.complete;
				this.studentSchoolInfoStatus = this.active;
			}
		} else if (this.role == 'Teacher') {
			if (this.wizard == 'personal-info') {
				this.personalInfoStatus = this.active
			} else if (this.wizard == 'account-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.active
			} else if (this.wizard == 'location-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.active;
			} else if (this.wizard == 'school-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.schoolInfoStatus = this.active;
			}
		} else if (this.role == 'Recruiter') {
			if (this.wizard == 'personal-info') {
				this.personalInfoStatus = this.active
			} else if (this.wizard == 'account-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.active
			} else if (this.wizard == 'location-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.active;
			} else if (this.wizard == 'school-info') {
				this.personalInfoStatus = this.complete;
				this.accountInfoStatus = this.complete;
				this.locationInfoStatus = this.complete;
				this.schoolInfoStatus = this.active;
				// } else if (this.wizard == 'coupon-code') {
				//   this.personalInfoStatus = this.complete;
				//   this.accountInfoStatus = this.complete;
				//   this.locationInfoStatus = this.complete;
				//   this.schoolInfoStatus = this.complete;
				//   this.coponCode = this.active;
			}
		}
	}

}
