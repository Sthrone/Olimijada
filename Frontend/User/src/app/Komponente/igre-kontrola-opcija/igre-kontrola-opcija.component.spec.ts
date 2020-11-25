import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgreKontrolaOpcijaComponent } from './igre-kontrola-opcija.component';

describe('IgreKontrolaOpcijaComponent', () => {
  let component: IgreKontrolaOpcijaComponent;
  let fixture: ComponentFixture<IgreKontrolaOpcijaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgreKontrolaOpcijaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgreKontrolaOpcijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
