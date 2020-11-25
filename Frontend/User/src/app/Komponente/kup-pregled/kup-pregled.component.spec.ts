import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KupPregledComponent } from './kup-pregled.component';

describe('KupPregledComponent', () => {
  let component: KupPregledComponent;
  let fixture: ComponentFixture<KupPregledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KupPregledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KupPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
