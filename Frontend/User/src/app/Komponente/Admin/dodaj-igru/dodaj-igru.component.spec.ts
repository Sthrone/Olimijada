import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajIgruComponent } from './dodaj-igru.component';

describe('DodajIgruComponent', () => {
  let component: DodajIgruComponent;
  let fixture: ComponentFixture<DodajIgruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajIgruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajIgruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
