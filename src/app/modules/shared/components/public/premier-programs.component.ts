import { Component } from '@angular/core';

import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-premier-programs',
	templateUrl: './premier-programs.component.html',
	styleUrls: ['./public.component.css']
})

export class PremierProgramsComponent {

	public user = new UserModel({});
	loggedin: boolean = false;

	constructor(
		public userService: UserService
	) { 
		if (this.userService.currentUser) {
			this.loggedin = true;
		}
	}

}