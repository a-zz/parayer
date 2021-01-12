import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActGroupComponent } from './act-group.component';

describe('ActGroupComponent', () => {
  let component: ActGroupComponent;
  let fixture: ComponentFixture<ActGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
