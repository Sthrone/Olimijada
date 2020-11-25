import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajTurnirComponent } from './dodaj-turnir.component';

describe('DodajTurnirComponent', () => {
  let component: DodajTurnirComponent;
  let fixture: ComponentFixture<DodajTurnirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajTurnirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajTurnirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
