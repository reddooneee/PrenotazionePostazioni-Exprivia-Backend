import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanimetriaModaleComponent } from './planimetria-modale.component';

describe('PlanimetriaModaleComponent', () => {
  let component: PlanimetriaModaleComponent;
  let fixture: ComponentFixture<PlanimetriaModaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanimetriaModaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanimetriaModaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
