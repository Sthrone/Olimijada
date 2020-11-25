import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledNovihTurniraAdminComponent } from './pregled-novih-turnira-admin.component';

describe('PregledNovihTurniraAdminComponent', () => {
  let component: PregledNovihTurniraAdminComponent;
  let fixture: ComponentFixture<PregledNovihTurniraAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregledNovihTurniraAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledNovihTurniraAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
