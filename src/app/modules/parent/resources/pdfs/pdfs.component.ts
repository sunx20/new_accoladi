import { Component } from '@angular/core';

@Component({
	selector: 'app-pdfs',
	templateUrl: './pdfs.component.html'
})

export class PDFsComponent {

	pdfs: any[];

	constructor() {
		this.pdfs = [
			{
				label: 'Career Consultation',
				description: '',
				url: 'https://s3.amazonaws.com/cdn.scholarshipauditions.com/members_pdfs/Career-Consultation.pdf'
			},
			{
				label: 'Getting Discovered',
				description: '',
				url: 'https://s3.amazonaws.com/cdn.scholarshipauditions.com/members_pdfs/Getting-Discovered.pdf'
			},
			{
				label: 'Scholarships',
				description: '',
				url: 'https://s3.amazonaws.com/cdn.scholarshipauditions.com/members_pdfs/Scholarships.pdf'
			},
			{
				label: 'Audition Checklist Timeline',
				description: '',
				url: 'https://s3.amazonaws.com/cdn.scholarshipauditions.com/members_pdfs/Resources-Audition-Checklist-Timeline.pdf'
			},
			{
				label: 'Find the Right Program',
				description: '',
				url: 'https://s3.amazonaws.com/cdn.scholarshipauditions.com/members_pdfs/Find-Right-Program.pdf'
			}
		];
	}

}
