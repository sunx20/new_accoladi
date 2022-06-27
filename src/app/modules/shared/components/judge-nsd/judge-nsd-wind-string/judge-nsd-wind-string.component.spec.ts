import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeNsdWindStringComponent } from './judge-nsd-wind-string.component';

describe('JudgeNsdWindStringComponent', () => {
  let component: JudgeNsdWindStringComponent;
  let fixture: ComponentFixture<JudgeNsdWindStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeNsdWindStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeNsdWindStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
