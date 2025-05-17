import { TestBed } from '@angular/core/testing';

import { SpecialtyService } from './specialty.service';

describe('SpecialtieService', () => {
  let service: SpecialtyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialtyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
