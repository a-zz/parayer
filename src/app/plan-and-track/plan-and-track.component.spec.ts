import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActGridComponent } from './act-grid.component';

describe('ActGridComponent', () => {
  let component: ActGridComponent;
  let fixture: ComponentFixture<ActGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
