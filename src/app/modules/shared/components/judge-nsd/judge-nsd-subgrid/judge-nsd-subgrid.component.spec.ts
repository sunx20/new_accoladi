import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeNsdSubgridComponent } from './judge-nsd-subgrid.component';

describe('JudgeNsdSubgridComponent', () => {
  let component: JudgeNsdSubgridComponent;
  let fixture: ComponentFixture<JudgeNsdSubgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeNsdSubgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeNsdSubgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
