import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpwdComponent } from './resetpwd.component';

describe('ResetpwdComponent', () => {
  let component: ResetpwdComponent;
  let fixture: ComponentFixture<ResetpwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetpwdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
