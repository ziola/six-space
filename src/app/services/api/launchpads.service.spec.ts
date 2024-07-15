import { TestBed } from '@angular/core/testing';

import { LaunchpadsService } from './launchpads.service';

describe('LaunchpadsService', () => {
  let service: LaunchpadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchpadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
