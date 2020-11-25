import { TestBed, inject } from '@angular/core/testing';

import { BotInfoService } from './bot-info.service';

describe('BotInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BotInfoService]
    });
  });

  it('should be created', inject([BotInfoService], (service: BotInfoService) => {
    expect(service).toBeTruthy();
  }));
});
