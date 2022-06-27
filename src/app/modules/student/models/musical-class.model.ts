export class MusicalClassModel {

	_id: string;
	musical_classes: string[];

	constructor (data) {
		Object.assign(this, data);
	}

}