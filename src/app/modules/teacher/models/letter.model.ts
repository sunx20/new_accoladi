export class LetterModel {
	to: string;
	subject: string;
	body: string;

	constructor (data: any) {
		Object.assign(this, data);
	}
}