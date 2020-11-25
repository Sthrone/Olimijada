import { TestBed, inject } from '@angular/core/testing';

import { MultilanguageService } from './multilanguage.service';

describe('MultilanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultilanguageService]
    });
  });

  it('should be created', inject([MultilanguageService], (service: MultilanguageService) => {
    expect(service).toBeTruthy();
  }));
});
