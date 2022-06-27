export class MessageModel {

	_id: string; // the identifier
	sender_id: string; // the senders ID
	reciepient: string[]; // emails array
	type: string; // type of message (Invite, Solicitiation, Message)
	subject: string; // subject line
	mesage: string; // message body
	date_sent?: string; // Date
	thread_id: string; // a thread ID - a thread starts with any NEW message
	reply_id: string; // an added ID to help identify 'response' in a lenghty thread.

	constructor (data) {
		Object.assign(this, data);
	}

}

export class MessageFormModel {
	thread: string;
	to: string; // Recipient
	priority: string; // priority - 'high' 'normal' 'low'
	msg: string; // the message

	constructor (data) {
		Object.assign(this, data);
	}

}