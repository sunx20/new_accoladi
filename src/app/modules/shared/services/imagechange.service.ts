import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class ImagechangeService {

	public profileImgChange$: EventEmitter<any>;

	constructor() {
		this.profileImgChange$ = new EventEmitter();
	}

	profileImageChange(link: any) {
		this.profileImgChange$.emit({ imgUrl: link });
	}

}