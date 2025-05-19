import { TestBed } from '@angular/core/testing';

import { MaintenanceProcedureService } from './maintenance-procedure.service';

describe('MaintenanceProcedureService', () => {
  let service: MaintenanceProcedureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceProcedureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
