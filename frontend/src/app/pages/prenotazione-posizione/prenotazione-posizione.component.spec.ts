import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotazionePosizioneComponent } from './prenotazione-posizione.component';

describe('PrenotazionePosizioneComponent', () => {
  let component: PrenotazionePosizioneComponent;
  let fixture: ComponentFixture<PrenotazionePosizioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenotazionePosizioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenotazionePosizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
