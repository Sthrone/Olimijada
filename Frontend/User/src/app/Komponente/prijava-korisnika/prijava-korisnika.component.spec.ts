import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrijavaKorisnikaComponent } from './prijava-korisnika.component';

describe('PrijavaKorisnikaComponent', () => {
  let component: PrijavaKorisnikaComponent;
  let fixture: ComponentFixture<PrijavaKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrijavaKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrijavaKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
