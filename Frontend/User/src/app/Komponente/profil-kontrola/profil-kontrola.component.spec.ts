import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilKontrolaComponent } from './profil-kontrola.component';

describe('ProfilKontrolaComponent', () => {
  let component: ProfilKontrolaComponent;
  let fixture: ComponentFixture<ProfilKontrolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilKontrolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilKontrolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
