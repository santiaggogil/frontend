import { TestBed } from '@angular/core/testing';

import { MayorService } from './mayor.service';

describe('MayorService', () => {
  let service: MayorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
