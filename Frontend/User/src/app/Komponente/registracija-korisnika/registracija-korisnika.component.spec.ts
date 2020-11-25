import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistracijaKorisnikaComponent } from './registracija-korisnika.component';

describe('RegistracijaKorisnikaComponent', () => {
  let component: RegistracijaKorisnikaComponent;
  let fixture: ComponentFixture<RegistracijaKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistracijaKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistracijaKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
