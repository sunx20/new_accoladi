import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeNsdVoiceComponent } from './judge-nsd-voice.component';

describe('JudgeNsdVoiceComponent', () => {
  let component: JudgeNsdVoiceComponent;
  let fixture: ComponentFixture<JudgeNsdVoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeNsdVoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeNsdVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
