import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorPolicyListComponent } from './list.component';

describe('ListComponent', () => {
  let component: OperatorPolicyListComponent;
  let fixture: ComponentFixture<OperatorPolicyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorPolicyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorPolicyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
