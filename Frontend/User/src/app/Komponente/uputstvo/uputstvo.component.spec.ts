import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UputstvoComponent } from './uputstvo.component';

describe('UputstvoComponent', () => {
  let component: UputstvoComponent;
  let fixture: ComponentFixture<UputstvoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UputstvoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UputstvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
