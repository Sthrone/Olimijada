import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIgaraComponent } from './lista-igara.component';

describe('ListaIgaraComponent', () => {
  let component: ListaIgaraComponent;
  let fixture: ComponentFixture<ListaIgaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIgaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIgaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
