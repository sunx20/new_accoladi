import { Component } from '@angular/core';


@Component({
	selector: 'app-grade-by-grade-guide',
	templateUrl: './grade-by-grade-guide.component.html',
	styleUrls: ['./public.component.css','./grade-by-grade-guide.component.css']
})

export class GradeByGradeGuideComponent {

	guide: string = '';

	constructor() {
		
		this.guide = '';
	 }

	setGuide(value) {
		this.guide = value;
		// console.log([value,this.guide]);
	}

}