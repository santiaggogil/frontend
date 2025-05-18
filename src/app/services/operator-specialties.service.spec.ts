import { TestBed } from '@angular/core/testing';

import { Operator_specialtyService } from './operator-specialties.service';

describe('OperatorSpecialtiesService', () => {
  let service: Operator_specialtyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Operator_specialtyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
