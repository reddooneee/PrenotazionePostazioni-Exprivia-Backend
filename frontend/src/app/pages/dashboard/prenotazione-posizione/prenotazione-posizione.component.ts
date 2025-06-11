import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@core/auth/auth.service";
import { CalendarComponent } from "@shared/components/calendar/calendar.component";
import { BookingState } from "./prenotazione-posizione.model";
import { Subject, takeUntil, firstValueFrom } from "rxjs";
import { Prenotazione, StatoPrenotazione } from "@core/models/prenotazione.model";
import { CosaDurata } from "@core/models/cosa-durata.model";
import { PrenotazionePosizioneService } from "./prenotazione-posizione.service";
import { Postazione } from "@/app/core/models/postazione.model";
import { Stanza, StanzaWithPostazioni } from "@core/models/stanza.model";
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarComponent, ToastModule],
  providers: [DatePipe],
  selector: "app-prenotazione-posizione",
  templateUrl: "./prenotazione-posizione.component.html",
  styleUrls: ['../../../shared/styles/toast.styles.css']
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
  sortedPrenotazioni: Prenotazione[] = [];
  coseDurata: CosaDurata[] = [];
  private destroy$ = new Subject<void>();

  // Sorting properties
  sortColumn: string = 'data_inizio'; // Default sort by date
  sortDirection: 'asc' | 'desc' = 'desc'; // Default to descending (latest first)

  // Predefined time slots
  timeSlots = [
    { label: '08:00 - 09:00', start: '08:00', end: '09:00' },
    { label: '09:00 - 10:00', start: '09:00', end: '10:00' },
    { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
    { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
    { label: '12:00 - 13:00', start: '12:00', end: '13:00' },
    { label: '13:00 - 14:00', start: '13:00', end: '14:00' },
    { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
    { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
    { label: '16:00 - 17:00', start: '16:00', end: '17:00' },
    { label: '17:00 - 18:00', start: '17:00', end: '18:00' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private prenotazionePosizioneService: PrenotazionePosizioneService,
    private toastService: ToastService,
    private datePipe: DatePipe
  ) {
    this.bookingForm = this.fb.group({
      tipo_stanza: ["", Validators.required],
      id_stanza: [null, Validators.required],
      id_postazione: [null, Validators.required],
      timeSlot: ["", Validators.required],
      selectedDate: [null, Validators.required],
      note: [""]
    });
  }

  ngOnInit(): void {
    this.loadPrenotazioneInfo();
    this.setupFormSubscriptions();
    this.loadMiePrenotazioni(); // Carica tutte le prenotazioni all'avvio
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPrenotazioneInfo(): void {
    this.state.isLoading = true;
    this.prenotazionePosizioneService.getStanzeWithPostazioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: { stanze: StanzaWithPostazioni[] }) => {
          this.state.stanze = response.stanze;
          this.tipiStanza = [...new Set(response.stanze.map((s: StanzaWithPostazioni) => s.tipo_stanza))].filter(Boolean) as string[];
          this.state.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Errore nel caricamento delle informazioni:', err);
          this.state.errorMessage = "Errore nel caricamento delle informazioni";
          this.showErrorToast(
            'Errore di Caricamento', 
            'Impossibile caricare le informazioni delle stanze. Ricarica la pagina per riprovare.'
          );
          this.state.isLoading = false;
        }
      });
  }

  private setupFormSubscriptions(): void {
    // Log iniziale del form
    console.log('Stato iniziale del form:', {
      formValues: this.bookingForm.value,
      formValid: this.bookingForm.valid,
      formTouched: this.bookingForm.touched,
      formDirty: this.bookingForm.dirty
    });

    // Sottoscrizione a tutti i cambiamenti del form
    this.bookingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        console.log('Form aggiornato:', {
          values,
          valid: this.bookingForm.valid,
          touched: this.bookingForm.touched,
          dirty: this.bookingForm.dirty,
          errors: this.bookingForm.errors,
          controls: {
            tipo_stanza: {
              value: this.bookingForm.get('tipo_stanza')?.value,
              valid: this.bookingForm.get('tipo_stanza')?.valid,
              errors: this.bookingForm.get('tipo_stanza')?.errors
            },
            id_postazione: {
              value: this.bookingForm.get('id_postazione')?.value,
              valid: this.bookingForm.get('id_postazione')?.valid,
              errors: this.bookingForm.get('id_postazione')?.errors
            },
            timeSlot: {
              value: this.bookingForm.get('timeSlot')?.value,
              valid: this.bookingForm.get('timeSlot')?.valid,
              errors: this.bookingForm.get('timeSlot')?.errors
            }
          }
        });
      });

    this.bookingForm.get("tipo_stanza")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipo => {
        console.log('Tipo stanza cambiato:', tipo);
        this.bookingForm.patchValue({
          id_stanza: null,
          id_postazione: null,
          timeSlot: ""
        });

        if (tipo) {
          console.log('Stanze disponibili:', this.state.stanze);
          const stanzeFiltrate = this.state.stanze.filter(s => s.tipo_stanza === tipo);
          console.log('Stanze filtrate per tipo:', stanzeFiltrate);

          this.state.postazioniDisponibili = stanzeFiltrate
            .flatMap(stanza => {
              console.log('Elaborazione stanza:', stanza);
              return stanza.postazioni
                .filter(p => p.id_postazione !== undefined && p.nomePostazione !== undefined)
                .map((p: Postazione) => ({
                  id_postazione: p.id_postazione!,
                  nomePostazione: p.nomePostazione!,
                  stanza_id: stanza.id_stanza,
                  stanza_nome: stanza.nome,
                  tipo_stanza: stanza.tipo_stanza
                }));
            });
          console.log('Postazioni disponibili aggiornate:', this.state.postazioniDisponibili);
        } else {
          this.state.postazioniDisponibili = [];
        }
      });

    this.bookingForm.get("id_postazione")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(postazioneId => {
        console.log('Postazione cambiata:', postazioneId);
        if (postazioneId) {
          console.log('Cercando postazione tra:', this.state.postazioniDisponibili);
          const postazioneIdNum = Number(postazioneId);
          const postazione = this.state.postazioniDisponibili.find(p => p.id_postazione === postazioneIdNum);
          console.log('Postazione trovata:', postazione);

          if (postazione) {
            console.log('Aggiornamento id_stanza da', this.bookingForm.get('id_stanza')?.value, 'a', postazione.stanza_id);
            this.bookingForm.patchValue({
              id_stanza: postazione.stanza_id
            }, { emitEvent: false });

            if (this.state.selectedDates.length > 0) {
              console.log('Caricamento slot per nuova postazione selezionata');
              this.loadAvailableTimeSlots(postazioneIdNum);
            }
          } else {
            console.error('Postazione non trovata per id:', postazioneId);
          }
        } else {
          console.log('Reset id_stanza a null');
          this.bookingForm.patchValue({
            id_stanza: null
          }, { emitEvent: false });
        }
      });
  }

  private loadAvailableTimeSlots(postazioneId: number): void {
    if (this.state.selectedDates.length === 0) return;

    this.state.isLoading = true;
    const selectedDate = this.state.selectedDates[0];
    console.log('Data selezionata per il caricamento degli slot:', selectedDate);

    this.prenotazionePosizioneService.getAvailableTimeSlots(selectedDate, postazioneId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (slots) => {
          console.log('Slot disponibili ricevuti:', slots);
          this.state.availableTimeSlots = slots.map(slot => ({
            startTime: (slot as any).start || slot.startTime,
            endTime: (slot as any).end || slot.endTime
          }));
          console.log('Stato dopo aggiornamento:', {
            availableSlots: this.state.availableTimeSlots.length,
            hasPostazione: !!this.bookingForm.get('id_postazione')?.value
          });
          this.state.isLoading = false;
        },
        error: (err: Error) => {
          console.error('Errore nel caricamento degli orari:', err);
          this.state.errorMessage = "Errore nel caricamento degli orari disponibili";
          this.showErrorToast(
            'Orari Non Disponibili', 
            'Impossibile caricare gli orari disponibili per questa postazione. Prova a selezionare un\'altra postazione.'
          );
          this.state.isLoading = false;
        }
      });
  }

  onDateSelectionChange(dates: Date[]): void {
    console.log('Date selezionate:', dates);
    this.state.selectedDates = dates;

    if (dates.length > 0) {
      // Update the form control with the selected date
      this.bookingForm.patchValue({
        selectedDate: dates[0]
      });
    } else {
      this.bookingForm.patchValue({
        selectedDate: null
      });
    }

    // Reset time slots when dates change
    this.state.availableTimeSlots = [];
    this.bookingForm.patchValue({
      timeSlot: ""
    });

    const postazioneId = this.bookingForm.get("id_postazione")?.value;
    console.log('Stato attuale:', {
      postazioneId,
      hasPostazione: !!postazioneId,
      hasDates: dates.length > 0,
      availableSlots: this.state.availableTimeSlots.length
    });

    if (postazioneId && dates.length > 0) {
      console.log('Caricamento slot disponibili per postazione:', postazioneId);
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

  onSubmit() {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;
      const selectedDate = formData.selectedDate;
      const selectedTimeSlot = formData.timeSlot;

      if (!selectedTimeSlot) {
        this.showErrorToast('Selezione Incompleta', 'Seleziona un orario per completare la prenotazione');
        return;
      }

      this.state.isLoading = true;
      
      // Show info toast while processing
      this.showInfoToast('Elaborazione in corso', 'Stiamo creando la tua prenotazione...');

      try {
        // Create start and end dates
        const startDateTime = new Date(selectedDate);
        const endDateTime = new Date(selectedDate);
        
        const [startHour, startMinute] = selectedTimeSlot.split(' - ')[0].split(':');
        const [endHour, endMinute] = selectedTimeSlot.split(' - ')[1].split(':');

        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

        // Format dates with seconds in local timezone
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        // Log the form data and selected values
        console.log('Form Data:', {
          raw: formData,
          selectedDate,
          selectedTimeSlot,
          startDateTime,
          endDateTime
        });

        const prenotazione = {
          id_postazione: parseInt(formData.id_postazione),
          id_stanza: parseInt(formData.id_stanza),
          data_inizio: formatDate(startDateTime),
          data_fine: formatDate(endDateTime)
        };

        // Validate the prenotazione object
        if (!prenotazione.id_postazione || !prenotazione.id_stanza) {
          throw new Error('ID postazione o ID stanza non validi');
        }

        if (!this.isValidDate(startDateTime) || !this.isValidDate(endDateTime)) {
          throw new Error('Date non valide');
        }

        console.log('Sending reservation request:', prenotazione);

        this.prenotazionePosizioneService.createPrenotazione(prenotazione)
          .subscribe({
            next: (response) => {
              console.log('Prenotazione creata:', response);
              this.clearAllToasts(); // Clear any existing toasts
              this.showSuccessToast(
                'Prenotazione Confermata!', 
                `La tua postazione è stata prenotata per ${this.formatDate(selectedDate, 'dd/MM/yyyy')} dalle ${selectedTimeSlot}`
              );
              this.resetForm();
              this.loadMiePrenotazioni(); // This will call applySorting internally
              this.state.isLoading = false;
            },
            error: (error) => {
              console.error('Errore completo nella creazione della prenotazione:', error);
              this.clearAllToasts(); // Clear any existing toasts
              
              let errorMessage = 'Si è verificato un errore durante la creazione della prenotazione';
              let errorSummary = 'Errore nella Prenotazione';
              
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
                if (error.message.includes('già prenotata')) {
                  errorSummary = 'Postazione Non Disponibile';
                  errorMessage = 'La postazione selezionata è già prenotata per questo orario. Seleziona un altro orario o postazione.';
                }
              }

              this.showErrorToast(errorSummary, errorMessage);
              this.state.isLoading = false;
            }
          });
      } catch (error) {
        console.error('Errore nella preparazione della prenotazione:', error);
        this.clearAllToasts();
        this.showErrorToast(
          'Errore di Validazione', 
          error instanceof Error ? error.message : 'I dati inseriti non sono validi. Controlla i campi e riprova.'
        );
        this.state.isLoading = false;
      }
    } else {
      const errors = [];
      if (!this.bookingForm.valid) errors.push('Compila tutti i campi richiesti');
      if (this.state.selectedDates.length === 0) errors.push('Seleziona una data');
      if (!this.bookingForm.get('timeSlot')?.value) errors.push('Seleziona un orario');

      this.showWarningToast('Campi Mancanti', errors.join(', '));
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

  isFormValid(): boolean {
    const formControls = this.bookingForm.controls;
    
    // Check if all required form controls have values
    const hasRequiredFields = 
      !!formControls['tipo_stanza'].value &&
      !!formControls['id_stanza'].value &&
      !!formControls['id_postazione'].value &&
      !!formControls['selectedDate'].value &&
      !!formControls['timeSlot'].value;

    // Check if the form is valid (this includes required field validation)
    const formValid = this.bookingForm.valid;

    /*console.log('Form validation state:', {
      hasRequiredFields,
      formValid,
      formValues: this.bookingForm.value,
      formErrors: this.bookingForm.errors,
      controlStates: {
        tipo_stanza: formControls['tipo_stanza'].value,
        id_stanza: formControls['id_stanza'].value,
        id_postazione: formControls['id_postazione'].value,
        selectedDate: formControls['selectedDate'].value,
        timeSlot: formControls['timeSlot'].value
      }
    });*/

    return hasRequiredFields && formValid;
  }

  private loadAllPrenotazioni(): void {
    this.state.isLoading = true;
    this.prenotazionePosizioneService.getUserPrenotazioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prenotazioni: Prenotazione[]) => {
          console.log('=== DETTAGLIO PRENOTAZIONI ===');
          console.log('Numero totale prenotazioni:', prenotazioni.length);
          
          // Log dettagliato di ogni prenotazione
          prenotazioni.forEach((p, index) => {
            console.group(`Prenotazione #${index + 1}`);
            console.log('ID:', p.id_prenotazioni);
            console.log('Data Inizio (raw):', p.data_inizio);
            console.log('Data Fine (raw):', p.data_fine);
            console.log('Stato:', p.stato_prenotazione);
            console.log('Utente:', {
              id: p.users?.id_user,
              email: p.users?.email,
              nome: p.users?.nome,
              cognome: p.users?.cognome
            });
            console.log('Stanza:', {
              id: p.stanze?.id_stanza,
              nome: p.stanze?.nome
            });
            console.log('Postazione:', {
              id: p.postazione?.id_postazione,
              nome: p.postazione?.nomePostazione
            });
            console.groupEnd();
          });

          // Parse e formatta le date
          this.prenotazioni = prenotazioni.map(p => ({
            ...p,
            data_inizio: this.parseDate(p.data_inizio),
            data_fine: this.parseDate(p.data_fine),
            stato_prenotazione: p.stato_prenotazione || StatoPrenotazione.Confermata
          }));

          this.state.isLoading = false;
          console.log('=== PRENOTAZIONI DOPO PARSING ===');
          console.log(JSON.stringify(this.prenotazioni, null, 2));
        },
        error: (error: Error) => {
          console.error('Errore nel caricamento delle prenotazioni:', error);
          this.showErrorToast('Errore', 'Errore nel caricamento delle prenotazioni');
          this.state.isLoading = false;
        }
      });
  }

  private loadMiePrenotazioni(): void {
    this.state.isLoading = true;
    this.prenotazionePosizioneService.getUserPrenotazioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prenotazioni: Prenotazione[]) => {
          console.group('Prenotazioni Utente');
          console.log('Raw prenotazioni data:', prenotazioni);
          
          // Process the prenotazioni with the new simplified structure
          this.prenotazioni = prenotazioni.map(p => ({
            ...p,
            data_inizio: this.parseDate(p.data_inizio),
            data_fine: this.parseDate(p.data_fine),
            stato_prenotazione: p.stato_prenotazione || StatoPrenotazione.Confermata,
            users: {
              id_user: p.users?.id_user || 0,
              nome: p.users?.nome || 'N/A',
              cognome: p.users?.cognome || 'N/A',
              email: p.users?.email || 'N/A',
              enabled: p.users?.enabled || false
            },
            postazione: {
              id_postazione: p.postazione?.id_postazione || 0,
              nomePostazione: p.postazione?.nomePostazione || 'N/A'
            },
            stanze: {
              id_stanza: p.stanze?.id_stanza || 0,
              nome: p.stanze?.nome || 'N/A',
              tipo_stanza: p.stanze?.tipo_stanza || 'N/A'
            }
          }));

          console.log('Processed prenotazioni:', this.prenotazioni);
          console.groupEnd();
          
          // Apply sorting after loading data
          this.applySorting();
          this.state.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nel caricamento delle prenotazioni:', error);
          this.showErrorToast('Errore', 'Errore nel caricamento delle prenotazioni');
          this.state.isLoading = false;
        }
      });
  }

  private parseDate(dateValue: any): Date {
    //console.log('Parsing date value:', dateValue);
    
    if (dateValue instanceof Date) {
      console.log('Value is already a Date');
      return dateValue;
    }
    
    if (Array.isArray(dateValue)) {
      try {
        // Array format: [year, month, day, hours, minutes, seconds, nanoseconds]
        const [year, month, day, hours, minutes] = dateValue;
        const date = new Date(year, month - 1, day, hours, minutes);
        //console.log('Parsed array date:', date);
        return date;
      } catch (error) {
        console.error('Error parsing array date:', error);
        return new Date();
      }
    }
    
    if (typeof dateValue === 'string') {
      // Se è una stringa che contiene virgole, è un array di numeri
      if (dateValue.includes(',')) {
        try {
          const [year, month, day, hours, minutes] = dateValue.split(',').map(Number);
          const date = new Date(year, month - 1, day, hours, minutes);
          //console.log('Parsed comma-separated date:', date);
          return date;
        } catch (error) {
          console.error('Error parsing comma-separated date:', error);
          return new Date();
        }
      }
      
      // Prova a parsare la stringa ISO
      try {
        const date = new Date(dateValue);
        //console.log('Parsed ISO date:', date);
        return date;
      } catch (error) {
        console.error('Error parsing ISO date:', error);
        return new Date();
      }
    }
    
    console.error('Unknown date format:', dateValue);
    return new Date();
  }

  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  formatDate(date: any, format: string): string {
    if (!this.isValidDate(date)) {
      return 'Data non valida';
    }
    return this.datePipe.transform(date, format, '', 'it-IT') || 'Data non valida';
  }

  getFormattedTimeRange(dataInizio: any, dataFine: any): string {
    if (!this.isValidDate(dataInizio) || !this.isValidDate(dataFine)) {
      return 'Orario non valido';
    }
    const inizio = this.formatDate(dataInizio, 'HH:mm');
    const fine = this.formatDate(dataFine, 'HH:mm');
    return `${inizio} - ${fine}`;
  }

  isValidTimeSlot(): boolean {
    const selectedTimeSlot = this.bookingForm.get('timeSlot')?.value;
    return !!(selectedTimeSlot && selectedTimeSlot.start && selectedTimeSlot.end);
  }

  deletePrenotazione(prenotazione: Prenotazione): void {
    if (!prenotazione.id_prenotazioni) {
      this.showErrorToast('Errore di Sistema', 'Impossibile identificare la prenotazione da eliminare');
      return;
    }

    // Conferma eliminazione
    const dataFormatted = this.formatDate(prenotazione.data_inizio, 'dd/MM/yyyy');
    const orarioFormatted = this.getFormattedTimeRange(prenotazione.data_inizio, prenotazione.data_fine);
    const postazioneNome = prenotazione.postazione?.nomePostazione || 'N/A';
    
    const conferma = confirm(
      `Sei sicuro di voler eliminare la prenotazione?\n\n` +
      `📅 Data: ${dataFormatted}\n` +
      `⏰ Orario: ${orarioFormatted}\n` +
      `💺 Postazione: ${postazioneNome}\n\n` +
      `Questa azione non può essere annullata.`
    );

    if (!conferma) {
      return;
    }

    this.state.isLoading = true;
    
    // Show info toast while processing
    this.showInfoToast('Eliminazione in corso', 'Stiamo cancellando la tua prenotazione...');

    this.prenotazionePosizioneService.deletePrenotazione(prenotazione.id_prenotazioni)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.clearAllToasts(); // Clear any existing toasts
          this.showSuccessToast(
            'Prenotazione Cancellata', 
            `La prenotazione del ${dataFormatted} è stata eliminata con successo`
          );
          
          // Rimuovi la prenotazione dalla lista locale
          this.prenotazioni = this.prenotazioni.filter(p => p.id_prenotazioni !== prenotazione.id_prenotazioni);
          // Update sorted array as well
          this.applySorting();
          this.state.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nell\'eliminazione della prenotazione:', error);
          this.clearAllToasts();
          
          let errorMessage = 'Si è verificato un errore durante l\'eliminazione della prenotazione';
          if (error.message?.includes('non trovata')) {
            errorMessage = 'La prenotazione non è più disponibile o è già stata eliminata';
          } else if (error.message?.includes('non autorizzato')) {
            errorMessage = 'Non hai i permessi per eliminare questa prenotazione';
          }
          
          this.showErrorToast('Errore nell\'Eliminazione', errorMessage);
          this.state.isLoading = false;
        }
      });
  }

  // Toast utility methods for consistent styling and messaging
  private showSuccessToast(summary: string, detail: string): void {
    this.toastService.showSuccess(summary, detail);
  }

  private showErrorToast(summary: string, detail: string): void {
    this.toastService.showError(summary, detail);
  }

  private showInfoToast(summary: string, detail: string): void {
    this.toastService.showInfo(summary, detail);
  }

  private showWarningToast(summary: string, detail: string): void {
    this.toastService.showWarning(summary, detail);
  }

  // Clear all existing toasts
  private clearAllToasts(): void {
    this.toastService.clear();
  }

  // Sorting methods
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  private applySorting(): void {
    this.sortedPrenotazioni = [...this.prenotazioni].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'data_inizio':
          valueA = new Date(a.data_inizio);
          valueB = new Date(b.data_inizio);
          break;
        case 'orario':
          // For time sorting, we'll use the start time
          valueA = new Date(a.data_inizio);
          valueB = new Date(b.data_inizio);
          break;
        case 'utente':
          // Sort by full name (nome + cognome)
          valueA = `${a.users?.nome || ''} ${a.users?.cognome || ''}`.trim().toLowerCase();
          valueB = `${b.users?.nome || ''} ${b.users?.cognome || ''}`.trim().toLowerCase();
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fas fa-sort text-gray-400';
    }
    return this.sortDirection === 'asc' ? 'fas fa-sort-up text-blue-600' : 'fas fa-sort-down text-blue-600';
  }

  isSortedColumn(column: string): boolean {
    return this.sortColumn === column;
  }
}
