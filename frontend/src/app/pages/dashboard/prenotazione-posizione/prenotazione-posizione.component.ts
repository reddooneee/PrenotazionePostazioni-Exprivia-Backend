import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@core/auth/auth.service";
import { CalendarComponent } from "@shared/components/calendar/calendar.component";
import { StanzaWithPostazioni } from "@core/models/stanza.model";
import { PostazioneWithStanza } from "@core/models/postazione.model";
import { PrenotazionePosizioneService } from "./prenotazione-posizione.service";
import { BookingFormData, BookingState, TimeSlot } from "./prenotazione-posizione.model";
import { Subject, takeUntil } from "rxjs";
import { Prenotazione } from "@core/models/prenotazione.model";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarComponent],
  selector: "app-prenotazione-posizione",
  templateUrl: "./prenotazione-posizione.component.html",
  providers: [PrenotazionePosizioneService]
})
export class PrenotazionePosizioneComponent implements OnInit, OnDestroy {
  bookingForm: FormGroup;
  state: BookingState = {
    stanze: [],
    postazioniDisponibili: [],
    selectedDates: [],
    availableTimeSlots: [],
    isLoading: false,
    errorMessage: ""
  };

  tipiStanza: string[] = [];
  prenotazioni: Prenotazione[] = [];
  private destroy$ = new Subject<void>();
  dataSpecifica = new Date(2025,5,27);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private prenotazioneService: PrenotazionePosizioneService
  ) {
    this.bookingForm = this.fb.group({
      tipo_stanza: ["", Validators.required],
      id_stanza: [null, Validators.required],
      id_postazione: [null, Validators.required],
      ora_inizio: ["", Validators.required],
      ora_fine: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStanzeEPostazioni();
    this.loadUserPrenotazioni();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStanzeEPostazioni(): void {
    this.state.isLoading = true;
    this.prenotazioneService.getStanzeWithPostazioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stanze) => {
          console.log('Received stanze:', stanze);
          this.state.stanze = stanze;
          this.tipiStanza = [...new Set(stanze.map(s => s.tipo_stanza))];
          console.log('Tipi stanza disponibili:', this.tipiStanza);
          this.state.isLoading = false;
        },
        error: (error) => {
          console.error("Error loading stanze:", error);
          this.state.errorMessage = "Errore nel caricamento delle stanze";
          this.state.isLoading = false;
        }
      });
  }

  private loadUserPrenotazioni(): void {
    this.prenotazioneService.getUserPrenotazioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prenotazioni: Prenotazione[]) => {
          this.prenotazioni = prenotazioni;
        },
        error: (error: unknown) => {
          console.error("Error loading user bookings:", error);
          this.state.errorMessage = "Errore nel caricamento delle prenotazioni";
        }
      });
  }

  private setupFormSubscriptions(): void {
    // Quando cambia il tipo stanza
    this.bookingForm.get("tipo_stanza")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipo => {
        console.log('Tipo stanza selezionato:', tipo);
        this.bookingForm.patchValue({
          id_stanza: null,
          id_postazione: null,
          ora_inizio: "",
          ora_fine: ""
        });
        
        if (tipo) {
          // Filtra le stanze per tipo
          const stanzeDelTipo = this.state.stanze.filter(s => s.tipo_stanza === tipo);
          console.log('Stanze filtrate per tipo:', stanzeDelTipo);
          
          // Ottieni tutte le postazioni per le stanze filtrate
          this.state.postazioniDisponibili = stanzeDelTipo.flatMap(stanza => 
            stanza.postazioni
              .filter(p => p.id_postazione && p.nomePostazione)
              .map(p => ({
                id_postazione: p.id_postazione!,
                nomePostazione: p.nomePostazione!,
                stanza_id: stanza.id_stanza,
                stanza_nome: stanza.nome,
                tipo_stanza: stanza.tipo_stanza
              }))
          );
          console.log('Postazioni disponibili aggiornate:', this.state.postazioniDisponibili);
        } else {
          this.state.postazioniDisponibili = [];
        }
      });

    // Quando cambia la postazione
    this.bookingForm.get("id_postazione")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(postazioneId => {
        if (postazioneId) {
          const postazione = this.state.postazioniDisponibili.find(p => p.id_postazione === postazioneId);
          if (postazione) {
            // Aggiorna automaticamente la stanza
            this.bookingForm.patchValue({
              id_stanza: postazione.stanza_id
            }, { emitEvent: false }); // Evita il loop di eventi
          }
          
          if (this.state.selectedDates.length > 0) {
            this.loadAvailableTimeSlots(postazioneId);
          }
        }
      });
  }

  onDateSelectionChange(dates: Date[]): void {
    this.state.selectedDates = dates;
    const postazioneId = this.bookingForm.get("id_postazione")?.value;
    if (postazioneId && dates.length > 0) {
      // Load time slots for the first selected date
      this.loadAvailableTimeSlots(postazioneId);
    }
  }

  removeDateFromSelection(dateToRemove: Date): void {
    this.state.selectedDates = this.state.selectedDates.filter(
      date => date.getTime() !== dateToRemove.getTime()
    );
    
    const postazioneId = this.bookingForm.get("id_postazione")?.value;
    if (postazioneId && this.state.selectedDates.length > 0) {
      this.loadAvailableTimeSlots(postazioneId);
    } else if (this.state.selectedDates.length === 0) {
      this.state.availableTimeSlots = [];
    }
  }

  private loadAvailableTimeSlots(postazioneId: number): void {
    if (this.state.selectedDates.length === 0) return;

    this.state.isLoading = true;
    this.prenotazioneService
      .getAvailableTimeSlots(this.state.selectedDates[0], postazioneId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (slots) => {
          this.state.availableTimeSlots = slots.map(s => s.start);
          this.state.isLoading = false;
        },
        error: (error) => {
          console.error("Error loading time slots:", error);
          this.state.errorMessage = "Errore nel caricamento degli orari disponibili";
          this.state.isLoading = false;
        }
      });
  }

  async createPrenotazione(): Promise<void> {
    if (!this.bookingForm.valid || this.state.selectedDates.length === 0) return;

    const formValue = this.bookingForm.value;
    this.state.isLoading = true;
    this.state.errorMessage = "";

    try {
      // Create an array of booking requests, one for each selected date
      const bookingRequests = this.state.selectedDates.map(date => ({
        id_stanza: formValue.id_stanza,
        id_postazione: formValue.id_postazione,
        data_inizio: new Date(new Date(date).setHours(parseInt(formValue.ora_inizio.split(":")[0]))).toISOString(),
        data_fine: new Date(new Date(date).setHours(parseInt(formValue.ora_fine.split(":")[0]))).toISOString()
      }));

      // Create all bookings sequentially
      for (const request of bookingRequests) {
        await this.prenotazioneService.createPrenotazione(request).toPromise();
      }

      // Reset form after all bookings are created
      this.resetForm();
      // Reload user bookings to show the new ones
      this.loadUserPrenotazioni();
    } catch (error) {
      console.error("Error creating prenotazioni:", error);
      this.state.errorMessage = "Errore nella creazione delle prenotazioni";
    } finally {
      this.state.isLoading = false;
    }
  }
  

  private resetForm(): void {
    this.bookingForm.reset();
    this.state.selectedDates = [];
    this.state.availableTimeSlots = [];
    this.state.errorMessage = "";
  }

  getStanzaName(stanzaId: number | undefined): string {
    if (!stanzaId) return '';
    const stanza = this.state.stanze.find(s => s.id_stanza === stanzaId);
    return stanza ? stanza.nome : '';
  }

  
  getFileByPrenotazioni(): void {
    this.state.isLoading = true;

    this.prenotazioneService.getFileByPrenotazioni(this.dataSpecifica).subscribe((blob: Blob) => {
      const nomeFile = `prenotazioni_${this.formattaData(this.dataSpecifica)}.xlsx`;

      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = nomeFile;
      link.click();
      window.URL.revokeObjectURL(url);

      this.state.isLoading = false;
    }, error => {
      console.error("Errore nel download del file:", error);
      this.state.isLoading = false;
    });
  }

  private formattaData(data: Date): string {
    const giorno = String(data.getDate()).padStart(2, '0');
    const mese = String(data.getMonth()).padStart(2, '0');
    const anno = data.getFullYear();
    return `${anno}-${mese}-${giorno}`;
  }

}
