import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeNsdKeyboardComponent } from './judge-nsd-keyboard.component';

describe('JudgeNsdKeyboardComponent', () => {
  let component: JudgeNsdKeyboardComponent;
  let fixture: ComponentFixture<JudgeNsdKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeNsdKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeNsdKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
