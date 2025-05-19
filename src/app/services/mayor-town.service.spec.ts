import { TestBed } from '@angular/core/testing';

import { MayorTownService } from './mayor-town.service';

describe('MayorTownService', () => {
  let service: MayorTownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorTownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
