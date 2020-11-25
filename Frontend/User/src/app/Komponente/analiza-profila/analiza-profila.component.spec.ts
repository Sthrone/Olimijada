import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizaProfilaComponent } from './analiza-profila.component';

describe('AnalizaProfilaComponent', () => {
  let component: AnalizaProfilaComponent;
  let fixture: ComponentFixture<AnalizaProfilaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalizaProfilaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalizaProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
