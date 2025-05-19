import { TestBed } from '@angular/core/testing';

import { ProjectTownService } from './project-town.service';

describe('ProjectTownService', () => {
  let service: ProjectTownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
