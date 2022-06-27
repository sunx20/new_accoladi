import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../modules/auth/auth.service';
import { UserService } from '../../services/user.service';
import { ImagechangeService } from './../../services/imagechange.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['../public/public.component.css']
})

export class HeaderComponent implements OnInit {

	public defaultProfileImage = '../../assets/img/avatar.png';
	public profileImage: any = null;
	fullname = '';
	email = ''
	isSidebarOpen = false;
	loggedIn = false;
	showBilling = false;
	isShown = false;

	constructor(
		private authService: AuthService,
		private userService: UserService,
		private router: Router,
		public imagechangeService: ImagechangeService,
	) {
		this.loggedIn = this.authService.isLoggedIn();
		this.imagechangeService
			.profileImgChange$
			.subscribe(
				res => {
					this.profileImage = res.imgUrl;
				}
			);

		if (this.userService.token) {
			this.setUsernameEmailNotifier();
		}
	}

	ngOnInit() {
		this.authService
			.loginSubscription
			.subscribe(
				(value: boolean) => {
					this.loggedIn = value;
					if (value) {
						setTimeout(() => {
							this.handleBillingLink();
							this.setUsernameEmailNotifier();
						}, 2000);
					} else {
						this.showBilling = false;
						this.email = '';
						this.fullname = '';
						this.profileImage = null;
					}
				}
			);

		if (this.loggedIn) {
			this.handleBillingLink();
		}

		this.userService
			.sidebarSubject
			.subscribe(
				(response: string) => {
					this.isSidebarOpen = response === 'true';
				}
			);
	}

	setUsernameEmailNotifier() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.fullname = response.data.first_name + ' ' + this.userService.currentUser.last_name;
					this.email = this.userService.currentUser.email;
				}
			);
	}

	handleBillingLink() {
		this.showBilling = false;
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.profileImage = response.data.profile_imageurl
						? response.data.profile_imageurl
						: this.defaultProfileImage;
					if (['Student'].includes(this.userService.currentUser.role)) {
						this.showBilling = true;
					}
				}
			);
	}

	onLogoutClick() {
		this.authService.logout();
		this.router.navigate(['/login']);
		return false;
	}

	onAccountClick() {
		if (this.userService.currentUser) {
			const role = this.userService.currentUser.role;
			if (role === 'Student') {
				this.router.navigate(['/student/settings']);
			} else if (role === 'Teacher') {
				this.router.navigate(['/teacher/settings'])
			} else if (role === 'Parent') {
				this.router.navigate(['/parent/settings']);
			} else if (role === 'Recruiter') {
				this.router.navigate(['/recruiter/settings']);
			} else {
				this.authService.logout();
				this.router.navigate(['/login']);
				return false;
			}
		}
	}

	onShowTourClick() {
		// Show the tour for current component
		return false;
	}

	backToDashboard() {
		const path = this.userService.currentUser.role.toLowerCase();
		if (path) {
			this.router.navigate(['/' + path]);
		}
	}

	toggleSidebar() {
		this.isSidebarOpen = !this.isSidebarOpen;
		this.userService.sidebar = this.isSidebarOpen.toString();
	}

}