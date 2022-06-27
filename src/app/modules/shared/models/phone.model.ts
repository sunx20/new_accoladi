export class PhoneModel {

	phone: string;
	international?: string;
	nation?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}