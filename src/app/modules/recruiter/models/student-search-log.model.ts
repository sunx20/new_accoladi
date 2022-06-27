export class studentSearchLogModel {

	student_id: string;
	searcher_id: string;
	date: Date;
	period: {
		year: number,
		month: number,
	};
	criteria: string;
	result_count: number;

	constructor (data) {
		Object.assign(this, data);
	}

}