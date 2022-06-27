import { Component } from '@angular/core';

@Component({
	selector: 'app-faqs',
	templateUrl: './faqs.component.html'
})

export class FaqsComponent {

	faqs: any[];

	constructor() {
		this.faqs = [
			{
				question: 'Question 1',
				answer: 'Answer 1'
			},
			{
				question: 'Question 2',
				answer: 'Answer 2'
			},
			{
				question: 'Question 3',
				answer: 'Answer 3'
			}
		];
	}

}