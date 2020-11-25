import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmeniIgruComponent } from './izmeni-igru.component';

describe('IzmeniIgruComponent', () => {
  let component: IzmeniIgruComponent;
  let fixture: ComponentFixture<IzmeniIgruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzmeniIgruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzmeniIgruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
