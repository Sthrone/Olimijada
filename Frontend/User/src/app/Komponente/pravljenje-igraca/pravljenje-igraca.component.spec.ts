import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PravljenjeIgracaComponent } from './pravljenje-igraca.component';

describe('PravljenjeIgracaComponent', () => {
  let component: PravljenjeIgracaComponent;
  let fixture: ComponentFixture<PravljenjeIgracaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PravljenjeIgracaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PravljenjeIgracaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
