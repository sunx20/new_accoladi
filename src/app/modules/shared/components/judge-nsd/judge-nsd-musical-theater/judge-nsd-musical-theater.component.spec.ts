import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeNsdMusicalTheaterComponent } from './judge-nsd-musical-theater.component';

describe('JudgeNsdMusicalTheaterComponent', () => {
  let component: JudgeNsdMusicalTheaterComponent;
  let fixture: ComponentFixture<JudgeNsdMusicalTheaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeNsdMusicalTheaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeNsdMusicalTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
