import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestiranjeBotaComponent } from './testiranje-bota.component';

describe('TestiranjeBotaComponent', () => {
  let component: TestiranjeBotaComponent;
  let fixture: ComponentFixture<TestiranjeBotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestiranjeBotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestiranjeBotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
