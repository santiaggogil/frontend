import { TestBed } from '@angular/core/testing';

import { SpecialtyTypeService } from './specialty-type.service';

describe('SpecialtyTypeService', () => {
  let service: SpecialtyTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialtyTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
