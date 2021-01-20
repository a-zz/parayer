import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefChipsComponent } from './ref-chips.component';

describe('RefChipsComponent', () => {
  let component: RefChipsComponent;
  let fixture: ComponentFixture<RefChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
