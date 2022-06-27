export class RegisterModel {

	first_name: string;
	middle_name?: string;
	last_name: string;
	username: string;
	email: string;
	role: string;
	password: string;
	confirm_password: string;
	promo_code?: string;
	college?: string;
	college_id?: string;
	title?: string;
	discipline?: string;
	faculty_url?: string;
	agree?: string;
	agent?: string;

	constructor(data?: any) {
		Object.assign(this, data);
	}
}