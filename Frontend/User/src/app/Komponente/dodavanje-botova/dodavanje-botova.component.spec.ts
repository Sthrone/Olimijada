import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeBotovaComponent } from './dodavanje-botova.component';

describe('DodavanjeBotovaComponent', () => {
  let component: DodavanjeBotovaComponent;
  let fixture: ComponentFixture<DodavanjeBotovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodavanjeBotovaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodavanjeBotovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
