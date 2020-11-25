import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaKorisnikaComponent } from './lista-korisnika.component';

describe('ListaKorisnikaComponent', () => {
  let component: ListaKorisnikaComponent;
  let fixture: ComponentFixture<ListaKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
