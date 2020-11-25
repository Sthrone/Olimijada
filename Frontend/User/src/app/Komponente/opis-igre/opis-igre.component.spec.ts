import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpisIgreComponent } from './opis-igre.component';

describe('OpisIgreComponent', () => {
  let component: OpisIgreComponent;
  let fixture: ComponentFixture<OpisIgreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpisIgreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpisIgreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
