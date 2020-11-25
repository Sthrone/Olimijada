import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizaKorisnikaComponent } from './analiza-korisnika.component';

describe('AnalizaKorisnikaComponent', () => {
  let component: AnalizaKorisnikaComponent;
  let fixture: ComponentFixture<AnalizaKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalizaKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalizaKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
