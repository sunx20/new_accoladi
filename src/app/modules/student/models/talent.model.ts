export class TalentModel {

	_id: string;
	family: string;
	talent: string;
	primary: string;
	year_started: string;
	range: string;
	reg1_range?: string;
	reg2_range?: string;
	reg3_range?: string;
	reg4_range?: string;
	styles?: Array<string>;
	emphasis?:Array<string>

	constructor (data) {
		Object.assign(this, data);
	}

}