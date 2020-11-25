import { TestBed, inject } from '@angular/core/testing';

import { IgreInfoService } from './igre-info.service';

describe('IgreInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IgreInfoService]
    });
  });

  it('should be created', inject([IgreInfoService], (service: IgreInfoService) => {
    expect(service).toBeTruthy();
  }));
});
