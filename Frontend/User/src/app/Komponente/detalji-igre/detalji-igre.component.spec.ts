import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiIgreComponent } from './detalji-igre.component';

describe('DetaljiIgreComponent', () => {
  let component: DetaljiIgreComponent;
  let fixture: ComponentFixture<DetaljiIgreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaljiIgreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiIgreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
