import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracijaKorisnikaDialogComponent } from './administracija-korisnika-dialog.component';

describe('AdministracijaKorisnikaDialogComponent', () => {
  let component: AdministracijaKorisnikaDialogComponent;
  let fixture: ComponentFixture<AdministracijaKorisnikaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracijaKorisnikaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracijaKorisnikaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
