import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledKorisnikaComponent } from './pregled-korisnika.component';

describe('PregledKorisnikaComponent', () => {
  let component: PregledKorisnikaComponent;
  let fixture: ComponentFixture<PregledKorisnikaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregledKorisnikaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
