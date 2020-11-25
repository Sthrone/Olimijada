import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledLigeComponent } from './pregled-lige.component';

describe('PregledLigeComponent', () => {
  let component: PregledLigeComponent;
  let fixture: ComponentFixture<PregledLigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregledLigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledLigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
