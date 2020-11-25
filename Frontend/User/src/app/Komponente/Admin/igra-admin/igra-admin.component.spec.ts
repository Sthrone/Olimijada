import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgraAdminComponent } from './igra-admin.component';

describe('IgraAdminComponent', () => {
  let component: IgraAdminComponent;
  let fixture: ComponentFixture<IgraAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgraAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgraAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
