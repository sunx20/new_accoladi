export class LoginModel {

	email: string;
	password: string;
	invite?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}