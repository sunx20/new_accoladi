// specifically used in the "ADD STUDENT" workflow
// a student will go into the DB as a user, with some
// extra identifiers. sponsor, parent, the "use address/phone"
// indicates server side logic to add data from the submitting user.
export class StudentModel {
	_id: string;
	first_name: string;
	middle_name?: String;
	last_name: String;
	username: String;
	email: String;
	dob: {
		year: number,
		month: number,
		day: number
	};
	parent?: boolean;
	sponsor?: boolean;
	use_address?: boolean;
	use_phone?: boolean;

	constructor (data) {
		Object.assign(this, data);
	}
}