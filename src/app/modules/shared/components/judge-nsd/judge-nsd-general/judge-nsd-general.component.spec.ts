import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeNsdGeneralComponent } from './judge-nsd-keyboard.component';

describe('JudgeNsdGeneralComponent', () => {
  let component: JudgeNsdGeneralComponent;
  let fixture: ComponentFixture<JudgeNsdGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeNsdGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeNsdGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
