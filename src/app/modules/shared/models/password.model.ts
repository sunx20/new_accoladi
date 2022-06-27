export class PasswordModel {

	password: string;
	password2: string;
	key: string;

	constructor (data) {
		Object.assign(this, data);
	}

}