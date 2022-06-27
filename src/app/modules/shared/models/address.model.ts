export class AddressModel {

	street1: string;
	street2?: string;
	city: string;
	state: string;
	postal_code: string;
	country?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}