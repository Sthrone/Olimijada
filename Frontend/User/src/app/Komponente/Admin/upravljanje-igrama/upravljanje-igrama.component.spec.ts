import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpravljanjeIgramaComponent } from './upravljanje-igrama.component';

describe('UpravljanjeIgramaComponent', () => {
  let component: UpravljanjeIgramaComponent;
  let fixture: ComponentFixture<UpravljanjeIgramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpravljanjeIgramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpravljanjeIgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
