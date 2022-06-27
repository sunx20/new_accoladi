export class ScholasticModel {

	gpa: number;
	act: number;
	sat: number;
	graduation_year:number;

	constructor (data) {
		Object.assign(this, data);
	}

}