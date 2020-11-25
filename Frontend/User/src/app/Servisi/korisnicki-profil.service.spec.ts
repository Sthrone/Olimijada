import { TestBed, inject } from '@angular/core/testing';

import { KorisnickiProfilService } from './korisnicki-profil.service';

describe('KorisnickiProfilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KorisnickiProfilService]
    });
  });

  it('should be created', inject([KorisnickiProfilService], (service: KorisnickiProfilService) => {
    expect(service).toBeTruthy();
  }));
});
