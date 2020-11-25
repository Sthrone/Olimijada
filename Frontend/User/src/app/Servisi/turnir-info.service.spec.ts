import { TestBed, inject } from '@angular/core/testing';

import { TurnirInfoService } from './turnir-info.service';

describe('TurnirInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnirInfoService]
    });
  });

  it('should be created', inject([TurnirInfoService], (service: TurnirInfoService) => {
    expect(service).toBeTruthy();
  }));
});
