import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledTurniraAdminComponent } from './pregled-turnira-admin.component';

describe('PregledTurniraAdminComponent', () => {
  let component: PregledTurniraAdminComponent;
  let fixture: ComponentFixture<PregledTurniraAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregledTurniraAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledTurniraAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
