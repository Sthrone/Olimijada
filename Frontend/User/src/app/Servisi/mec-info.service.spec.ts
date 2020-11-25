import { TestBed, inject } from '@angular/core/testing';

import { MecInfoService } from './mec-info.service';

describe('MecInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MecInfoService]
    });
  });

  it('should be created', inject([MecInfoService], (service: MecInfoService) => {
    expect(service).toBeTruthy();
  }));
});
