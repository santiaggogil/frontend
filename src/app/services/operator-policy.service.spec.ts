import { TestBed } from '@angular/core/testing';

import { OperatorPolicyervice } from './operator-policy.service';

describe('OperatorPolicyService', () => {
  let service: OperatorPolicyervice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorPolicyervice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
