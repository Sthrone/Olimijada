import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObradaPrijavaComponent } from './obrada-prijava.component';

describe('ObradaPrijavaComponent', () => {
  let component: ObradaPrijavaComponent;
  let fixture: ComponentFixture<ObradaPrijavaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObradaPrijavaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObradaPrijavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
