import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacijaComponent } from './simulacija.component';

describe('SimulacijaComponent', () => {
  let component: SimulacijaComponent;
  let fixture: ComponentFixture<SimulacijaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulacijaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
