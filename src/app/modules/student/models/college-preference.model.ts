export class CollegePreferenceModel {

	colleges?: any[];
	majors?: any[];
	ensembles?: any[];
	military?: any[];

	constructor(data) {
		Object.assign(this, data);
	}

}