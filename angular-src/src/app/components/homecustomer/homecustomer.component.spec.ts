import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomecustomerComponent } from './homecustomer.component';

describe('HomecustomerComponent', () => {
  let component: HomecustomerComponent;
  let fixture: ComponentFixture<HomecustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomecustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomecustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
