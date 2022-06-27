import { Component, OnInit } from '@angular/core';

import { PremierProgramService } from '../../../services/premier-program.service';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-premier-program-saved',
	templateUrl: './premier-program-saved.component.html'
})

export class PremierProgramSavedComponent implements OnInit {

	public user = new UserModel({});
	savedPremierProgramsList: any[] = [];

	constructor(
		private premierProgramService: PremierProgramService,
		private userService: UserService
	) {
		
	}

	ngOnInit() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe((response: any) => {
				this.savedPremierProgramsList = response.data.saved_premier_programs;
			});
	}

	remove(id: string) {
		this.premierProgramService
			.removeSavedPremierProgram(
				this.userService.currentUser._id, 
				id
			)
			.subscribe((response: any) => {
				this.savedPremierProgramsList = response.data.saved_premier_programs;
			});
	}

}