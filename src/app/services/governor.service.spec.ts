import { TestBed } from '@angular/core/testing';

import { GovernorService } from './governor.service';

describe('GovernorService', () => {
  let service: GovernorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
