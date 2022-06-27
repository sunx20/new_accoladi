export class SchoolModel {
	
	_id?: string;
	school_type?: string;
	name: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		zip2?: string;
	};
	phone?: string;
	county?: string;
	district?: string;
	locale?: string;
	low_grade?: string;
	high_grade?: string;
	meta?: {
		magnet?: boolean;
		charter?: boolean;
		teachers?: number;
		students?: number;
		student_teacher_ratio?: number;
		title_1_school?: boolean;
		title_1_school_wide?: boolean;
		free_lunch?: number;
		reduced_lunch?: number
	};
	refs?: {
		nces_school_id?: number;
		nces_district_id?: number;
		state_school_id?: string;
		state_district_id?: string;
		locale_code?: number
	};

	constructor (data) {
		Object.assign(this, data);
	}

}