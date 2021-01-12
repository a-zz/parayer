import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActAreaComponent } from './act-area.component';

describe('ActAreaComponent', () => {
  let component: ActAreaComponent;
  let fixture: ComponentFixture<ActAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
