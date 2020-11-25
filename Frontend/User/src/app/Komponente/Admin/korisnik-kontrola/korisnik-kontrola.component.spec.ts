import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikKontrolaComponent } from './korisnik-kontrola.component';

describe('KorisnikKontrolaComponent', () => {
  let component: KorisnikKontrolaComponent;
  let fixture: ComponentFixture<KorisnikKontrolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KorisnikKontrolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KorisnikKontrolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
