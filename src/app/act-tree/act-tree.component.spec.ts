import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActTreeComponent } from './act-tree.component';

describe('ActTreeComponent', () => {
  let component: ActTreeComponent;
  let fixture: ComponentFixture<ActTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
