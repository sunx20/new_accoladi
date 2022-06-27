import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, tap, switchMap } from 'rxjs/operators';

import { RegisterModel } from '../models/register.model';
import { UserService, CollegeService, ValidateEmailNotTaken, CustomValidators } from '../../shared/shared.module';
import { AuthService } from '../auth.service';
import { SaveStripeCardComponent } from '../../shared/components/billing/save-stripe-card/save-stripe-card.component';
import { PaymentService } from './../../shared/services/payment.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	form: FormGroup;
	model = new RegisterModel();
	submitAttempted = false;
	loading = false;
	registerSuccess = false;
	registerFailed = false;
	feedback: string;
	roles: string[];
	role: string;
	agent: string;
	invite = '';
	searchingColleges = false;
	searchFailed = false;
	agreed = true;
	requireCCforSignup = false;

	constructor(
		private userService: UserService,
		private authService: AuthService,
		private collegeService: CollegeService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private paymentService: PaymentService,
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
	) {
		this.form = new FormGroup(
			{
				first_name: new FormControl('', [Validators.required]),
				middle_name: new FormControl(''),
				last_name: new FormControl('', [Validators.required]),
				role: new FormControl('', [Validators.required]),
				username: new FormControl('', [Validators.required]),
				email: new FormControl('', [Validators.required, Validators.email], ValidateEmailNotTaken.createValidator(this.userService)),
				password: new FormControl('', [Validators.required]),
				confirm_password: new FormControl('', [Validators.required]),
				zip_code: new FormControl('', [Validators.required]),
				promo_code: new FormControl(''),
				college: new FormControl(''),
				college_id: new FormControl(''),
				title: new FormControl(''),
				discipline: new FormControl(''),
				faculty_url: new FormControl(''),
				agree: new FormControl(''),
				agent: new FormControl(''),
				soar_id: new FormControl('')
			},
			{
				validators: CustomValidators.checkPasswords
			}
		);

		this.roles = ['Student', 'Teacher', 'Recruiter'];
	}

	ngOnInit() {
		this.form
			.get('role')
			.valueChanges
			.subscribe(val => {
				this.role = val;
				if (val !== 'Recruiter') {
					this.agreed = true;
				}
			});

		this.agreed = this.form.get('role').value === 'Recruiter' && this.form.get('agree').value;

		this.form
			.get('agree')
			.valueChanges
			.subscribe(val => {
				if (val) {
					this.agreed = this.form.get('role').value === 'Recruiter';
				} else {
					this.agreed = false;
				}
			});

		this.activatedRoute
			.queryParams
			.subscribe((params: Params) => { console.log('query params:', params);
				if (params.inv) {
					this.invite = params['inv'];
				}

				if (params.agent) {
					this.form.get('agent').setValue(params['agent']);
					this.form.get('agent').disable();
				}

				// SOAR info - coming from a SOAR landing page... passing form data to back end
				if (params.p) {
					this.form.get('promo_code').setValue(params['p']);
					this.form.get('promo_code').disable();
				}

				if (params.s) {
					this.form.get('soar_id').setValue(params['s']);
				}

				if ( 
					params['role'] &&
					this.roles
						.map(role => role.toLowerCase())
						.includes(params['role'].toLowerCase())
				) {
					this.role = params['role'];
					this.role = this.role[0].toUpperCase() + this.role.slice(1);
					this.form.get('role').setValue(this.role);
					this.form.get('role').disable();
				}
			});

		if (this.authService.isLoggedIn()) {
			this.router
				.navigate([
					this.userService.currentUser.role.toLowerCase()
				]);
		}

		this.activatedRoute
			.params
			.subscribe((params: Params) => { console.log('params:', params);
				if (params['promo']) {
					this.form.get('promo_code').setValue(params['promo']);
					this.form.get('promo_code').disable();
				}

				if (
					params['role'] &&
					this.roles
						.map(role => role.toLowerCase())
						.includes(params['role'].toLowerCase())
				) {
					let role = params['role'];
					role = role[0].toUpperCase() + role.slice(1);
					this.form.get('role').setValue(role);
					this.form.get('role').disable();
				}
			});
	}

	selectRole(role) {
		console.log(role);
		this.form.get('role').setValue(role);
	}

	searchColleges = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 2),
			tap(() => (this.searchingColleges = true)),
			switchMap(term =>
				this.collegeService.getCollegeListByKeyword(term).pipe(
					map((res: any) => res.data),
					tap(() => (this.searchFailed = false)),
					catchError(() => {
						this.searchFailed = true;
						return of([]);
					})
				)
			),
			tap(() => {
				this.searchingColleges = false;
			})
		);
	}

	selectedCollege = (e: any) => {
		const item = e.item;
		this.form.get('college').setValue(item.name);
		this.form.get('college_id').setValue(item._id);
	}

	formatMatches = (item: any) => {
		if (!item) {
			return '';
		}
		return item.name;
	}

	get formModel() {
		let register: any = {
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			role: this.form.get('role').value,
			username: this.form.get('username').value,
			email: this.form.get('email').value,
			password: this.form.get('password').value,
			confirm_password: this.form.get('confirm_password').value,
			zip_code: this.form.get('zip_code').value,
			promo_code: this.form.get('promo_code').value,
			agent: this.form.get('agent').value,
			soar_id: this.form.get('soar_id').value
		};

		const recruiter_fields: any = {
			college: this.form.get('college').value
				? this.form.get('college').value.name
				: '',
			college_id: this.form.get('college_id').value,
			title: this.form.get('title').value,
			discipline: this.form.get('discipline').value,
			faculty_url: this.form.get('faculty_url').value,
			agree: this.form.get('agree').value
		};

		if (this.form.get('role').value === 'Recruiter') {
			register = {
				...register,
				...recruiter_fields
			};
		}

		if (this.invite) {
			register.invite = this.invite;
		}

		return register;
	}

	resetForm() {
		this.form.reset();
		this.submitAttempted = false;
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldInvalid(field),
			'has-feedback': this.isFieldInvalid(field)
		};
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.registerFailed = false;
			this.registerSuccess = false;

			if (this.form.valid) {
				this.authService.register(this.formModel).subscribe(
					(data: any) => {
						if (this.formModel.role.toLowerCase() === 'recruiter') {
							return this.router.navigate(['/welcome/recruiter']);
						}
						this.loading = false;
						this.registerSuccess = true;
						this.feedback = 'Successful registration.';
						this.authService
							.login(this.formModel)
							.subscribe((response: any) => {
								if (
									response &&
									response.data &&
									response.data.token
								) {
									this.authService.saveToStorage(response.data);
									if (this.requireCCforSignup && this.formModel.role.toLowerCase() === 'student') {
										localStorage.setItem('welcome_seen', 'no');
										this.router.navigate(['/premium']);
									} else if (this.requireCCforSignup && this.formModel.role.toLowerCase() === 'parent') {
										localStorage.setItem('welcome_seen', 'no');
										this.openSaveCardModal();
									} else {
										this.router.navigate(['/welcome/' + this.formModel.role.toLowerCase()]);
									}
								}
							});
					},
					err => {
						this.loading = false;
						this.registerFailed = true;
						if (err.error.status === 'failed') {
							this.feedback = err.error.message;
						} else {
							this.feedback = 'Unable to process this request';
						}
					}
				);
			} else {
				this.validateAllFormFields(this.form);
				this.loading = false;
				this.submitAttempted = false;
			}
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	openSaveCardModal() {
		const modalRef = this.modalService.open(SaveStripeCardComponent, {
			size: 'lg',
			backdrop: 'static',
			keyboard: false
		});

		modalRef.result.then(
			(token: any) => { // save default card
				this.paymentService.saveDefaultCard(this.userService.currentUser._id, token).subscribe((customer: any) => {
					if (localStorage.getItem('welcome_seen') === 'no') {
						localStorage.removeItem('welcome_seen');
						this.router.navigate(['/welcome/' + this.userService.currentUser.role.toLowerCase()]);
					} else {
						this.router.navigate(['/' + this.userService.currentUser.role.toLowerCase() + '/settings']);
					}
				});
			},
			reason => { }
		);
	}

}