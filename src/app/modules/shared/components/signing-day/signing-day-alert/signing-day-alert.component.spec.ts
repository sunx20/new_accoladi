import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigningDayAlertComponent } from './signing-day-alert.component';

describe('SigningDayAlertComponent', () => {
	let component: SigningDayAlertComponent;
	let fixture: ComponentFixture<SigningDayAlertComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SigningDayAlertComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SigningDayAlertComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

});
