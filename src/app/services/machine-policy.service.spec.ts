import { TestBed } from '@angular/core/testing';

import { MachinePolicyService } from './machine-policy.service';

describe('MachinePolicyService', () => {
  let service: MachinePolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachinePolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
