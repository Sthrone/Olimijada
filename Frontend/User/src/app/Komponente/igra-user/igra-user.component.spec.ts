import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgraUserComponent } from './igra-user.component';

describe('IgraUserComponent', () => {
  let component: IgraUserComponent;
  let fixture: ComponentFixture<IgraUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgraUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgraUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
