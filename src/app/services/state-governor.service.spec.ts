import { TestBed } from '@angular/core/testing';

import { StateGovernorService } from './state-governor.service';

describe('StateGovernorService', () => {
  let service: StateGovernorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateGovernorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
