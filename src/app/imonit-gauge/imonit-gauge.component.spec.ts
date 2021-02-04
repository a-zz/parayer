import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImonitGaugeComponent } from './imonit-gauge.component';

describe('ImonitGaugeComponent', () => {
  let component: ImonitGaugeComponent;
  let fixture: ComponentFixture<ImonitGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImonitGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImonitGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
