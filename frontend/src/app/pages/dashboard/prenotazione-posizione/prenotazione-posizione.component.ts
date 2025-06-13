import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from "@angular/forms";
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
import { User } from '@core/models';
import { AdminService } from '@core/services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CalendarComponent, ToastModule],
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

  // Filter properties
  statusFilter: 'tutti' | 'attive' | 'scadute' | 'annullate' = 'attive'; // Default to active

  // Admin and user selection properties
  isAdmin = false;
  users: User[] = [];
  userSearchTerm: string = '';
  filteredUsers: User[] = [];
  showUserDropdown: boolean = false;
  selectedUser: User | null = null;

  // Map duration label to minutes
  readonly durationMap: { [key: string]: number } = {
    'Giornata Intera': 600,
    '4h': 240,
    '2h': 120,
    '1h': 60,
    '30m': 30
  };

  get availableDurations(): string[] {
    if (!this.state.availableTimeSlots || this.state.availableTimeSlots.length === 0) {
      return [];
    }

    const durations = new Set<string>();
    
    // Controlla se la data selezionata è oggi per applicare filtri temporali
    const selectedDate = this.state.selectedDates[0];
    const today = new Date();
    const isToday = selectedDate && this.isSameDay(selectedDate, today);
    
    let availableSlots = this.state.availableTimeSlots;
    
    // Se è oggi, filtra gli slot che sono già passati
    if (isToday) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      availableSlots = this.state.availableTimeSlots.filter(slot => {
        const slotStartHour = parseInt(slot.startTime.split(':')[0]);
        const slotStartMinute = parseInt(slot.startTime.split(':')[1]);
        const slotStartInMinutes = slotStartHour * 60 + slotStartMinute;
        
        // Applica margine di 30 minuti
        return slotStartInMinutes > (currentTimeInMinutes + 30);
      });
    }

    // Check for full day slot (08:00 - 18:00) - solo se ancora disponibile
    if (availableSlots.some(slot => slot.startTime === '08:00' && slot.endTime === '18:00')) {
      durations.add('Giornata Intera');
    }

    // Check for other durations usando solo slot disponibili
    availableSlots.forEach(slot => {
      const start = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
      const end = parseInt(slot.endTime.split(':')[0]) * 60 + parseInt(slot.endTime.split(':')[1]);
      const duration = end - start;

      switch (duration) {
        case 240:
          durations.add('4h');
          break;
        case 120:
          durations.add('2h');
          break;
        case 60:
          durations.add('1h');
          break;
        case 30:
          durations.add('30m');
          break;
      }
    });

    return Array.from(durations);
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private prenotazionePosizioneService: PrenotazionePosizioneService,
    private toastService: ToastService,
    private datePipe: DatePipe,
    private adminService: AdminService
  ) {
    this.bookingForm = this.fb.group({
      userId: [''], // Campo opzionale per la selezione utente (solo admin)
      tipo_stanza: ["", Validators.required],
      id_stanza: [null, Validators.required],
      id_postazione: ["", Validators.required],
      slotDuration: ["", Validators.required],
      timeSlot: ["", Validators.required],
      selectedDate: [null, Validators.required],
      note: [""]
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
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
          id_postazione: "",
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
        console.log('DEBUG: Cambio postazione, nuovo id:', postazioneId);
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

            // Always load available time slots if both postazione and date are selected
            if (this.state.selectedDates.length > 0) {
              console.log('DEBUG: Chiamo loadAvailableTimeSlots da valueChanges con', postazioneIdNum);
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

    this.bookingForm.get("slotDuration")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.bookingForm.patchValue({ timeSlot: "" });
        const postazioneId = this.bookingForm.get("id_postazione")?.value;
        // Always reload available time slots for the selected postazione and date
        if (postazioneId && this.state.selectedDates.length > 0) {
          console.log('DEBUG: Chiamo loadAvailableTimeSlots da slotDuration con', postazioneId);
          this.loadAvailableTimeSlots(Number(postazioneId));
        }
      });
  }

  private loadAvailableTimeSlots(postazioneId: any): void {
    const postazioneIdNum = Number(postazioneId);
    if (isNaN(postazioneIdNum) || this.state.selectedDates.length === 0) {
      console.warn('ID postazione non valido o nessuna data selezionata:', postazioneId);
      this.state.isLoading = false;
      return;
    }

    const selectedDate = this.state.selectedDates[0];
    const selectedDuration = this.bookingForm.get('slotDuration')?.value;

    console.log('DEBUG: loadAvailableTimeSlots details:', {
      postazioneId: postazioneIdNum,
      selectedDate,
      selectedDuration,
      formValues: this.bookingForm.value,
      availableDurations: this.availableDurations
    });

    this.prenotazionePosizioneService.getAvailableTimeSlots(selectedDate, postazioneIdNum)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (slots) => {
          this.state.availableTimeSlots = slots;
          console.log('Available time slots:', slots);

          // Aggiorna availableDurations dopo aver impostato gli slot
          const currentAvailableDurations = this.availableDurations;
          console.log('DEBUG: Updated available durations:', currentAvailableDurations);

          // Reset duration if current selection is not available
          if (selectedDuration && !currentAvailableDurations.includes(selectedDuration)) {
            console.log('DEBUG: Selected duration not in available durations, resetting form');
            this.bookingForm.patchValue({ 
              slotDuration: '',
              timeSlot: ''
            });
          }

          // If we have slots and current duration is not set or invalid, select the first available duration
          const currentDuration = this.bookingForm.get('slotDuration')?.value;
          if (slots.length > 0 && (!currentDuration || !currentAvailableDurations.includes(currentDuration))) {
            const firstAvailableDuration = currentAvailableDurations[0];
            if (firstAvailableDuration) {
              console.log('DEBUG: Setting first available duration:', firstAvailableDuration);
              this.bookingForm.patchValue({ slotDuration: firstAvailableDuration });
            }
          }

          if (selectedDuration === 'Giornata Intera') {
            const fullDaySlot = slots.find(slot => slot.startTime === '08:00' && slot.endTime === '18:00');
            this.bookingForm.get('timeSlot')?.setValue(fullDaySlot ? '08:00 - 18:00' : '');
          }

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
    // Only allow one date
    const selected = dates && dates.length > 0 ? [dates[0]] : [];
    
    // Update the selected dates immediately for visual feedback
    this.state.selectedDates = [...selected];
    
    // Update the selectedDate form control immediately
    this.bookingForm.patchValue({
      selectedDate: selected.length > 0 ? selected[0] : null,
      timeSlot: "",
      slotDuration: ""
    });
    this.state.availableTimeSlots = [];
    
    // Check if the selected date has any available slots
    if (selected.length > 0) {
      const postazioneId = this.bookingForm.get("id_postazione")?.value;
      if (postazioneId) {
        this.state.isLoading = true;
        this.prenotazionePosizioneService.getAvailableTimeSlots(selected[0], Number(postazioneId))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (slots) => {
              this.state.availableTimeSlots = slots;
              
              // Update form with selected date
              this.bookingForm.patchValue({
                selectedDate: selected[0]
              });
              
              if (slots.length === 0) {
                this.showWarningToast('Data Non Disponibile', 'Nessun orario disponibile per questa data');
                // Keep the date selected but clear time slots
                this.bookingForm.patchValue({
                  timeSlot: "",
                  slotDuration: ""
                });
              } else {
                // Auto-select first available duration (considerando filtri temporali)
                const availableDurations = this.availableDurations;
                if (availableDurations.length > 0) {
                  const currentSlotDuration = this.bookingForm.get('slotDuration')?.value;
                  // Use current selection if valid, otherwise use first available
                  const durationToUse = availableDurations.includes(currentSlotDuration) 
                    ? currentSlotDuration 
                    : availableDurations[0];
                    
                  this.bookingForm.patchValue({
                    slotDuration: durationToUse
                  });
                  
                  // Auto-select first time slot for the duration
                  const filteredSlots = this.getFilteredTimeSlots();
                  if (filteredSlots.length > 0) {
                    const firstSlot = filteredSlots[0];
                    this.bookingForm.patchValue({
                      timeSlot: `${firstSlot.startTime} - ${firstSlot.endTime}`
                    });
                  }
                } else {
                  // Nessuna durata disponibile, pulisci tutto
                  this.bookingForm.patchValue({
                    slotDuration: "",
                    timeSlot: ""
                  });
                }
              }
              
              this.state.isLoading = false;
            },
            error: (err) => {
              console.error('Errore nel controllo della disponibilità:', err);
              this.showErrorToast('Errore', 'Impossibile verificare la disponibilità per questa data');
              // Keep the date selected even on error
              this.state.selectedDates = selected;
              this.state.availableTimeSlots = [];
              this.bookingForm.patchValue({
                selectedDate: selected[0],
                timeSlot: "",
                slotDuration: "" // Keep it empty for consistency
              });
              this.state.isLoading = false;
            }
          });
      }
    } else {
      // Reset state when no date is selected
      this.state.selectedDates = [];
      this.bookingForm.patchValue({
        selectedDate: null,
        timeSlot: "",
        slotDuration: ""
      });
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

        // Support both '08:00 - 18:00' and 'Giornata Intera' as input
        let startHour, startMinute, endHour, endMinute;
        if (selectedTimeSlot === '08:00 - 18:00' || selectedTimeSlot === 'Giornata Intera') {
          startHour = '08'; startMinute = '00'; endHour = '18'; endMinute = '00';
        } else {
          [startHour, startMinute] = selectedTimeSlot.split(' - ')[0].split(':');
          [endHour, endMinute] = selectedTimeSlot.split(' - ')[1].split(':');
        }

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
          endDateTime,
          formattedStart: formatDate(startDateTime),
          formattedEnd: formatDate(endDateTime)
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

        // Determine which service method to use based on admin status and user selection
        const userId = this.bookingForm.get('userId')?.value;
        const serviceCall = this.isAdmin && userId 
          ? this.prenotazionePosizioneService.createPrenotazioneAdmin({ ...prenotazione, id_user: parseInt(userId) })
          : this.prenotazionePosizioneService.createPrenotazione(prenotazione);

        serviceCall.subscribe({
            next: (response) => {
              console.log('Prenotazione creata:', response);
              this.clearAllToasts(); // Clear any existing toasts
              this.showSuccessToast(
                'Prenotazione Confermata!', 
                `La postazione è stata prenotata per ${this.formatDate(selectedDate, 'dd/MM/yyyy')} dalle ${selectedTimeSlot === '08:00 - 18:00' ? 'Giornata Intera' : selectedTimeSlot}`
              );
              
              // Reset form and reload data
              this.resetForm();
              this.loadMiePrenotazioni();
              
              // Force reload of available time slots for the current date and postazione
              const currentPostazioneId = this.bookingForm.get('id_postazione')?.value;
              if (currentPostazioneId && this.state.selectedDates.length > 0) {
                console.log('DEBUG: Reloading time slots after booking');
                this.loadAvailableTimeSlots(currentPostazioneId);
              }
              
              this.state.isLoading = false;
            },
            error: (error) => {
              console.error('Errore completo nella creazione della prenotazione:', error);
              this.clearAllToasts();
              this.showErrorToast(
                'Errore di Validazione', 
                error instanceof Error ? error.message : 'I dati inseriti non sono validi. Controlla i campi e riprova.'
              );
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
    
    // Reset user selection for admin
    if (this.isAdmin) {
      this.clearUserSearch();
    }
  }

  getStanzaName(stanzaId: number | undefined): string {
    if (!stanzaId) return '';
    const stanza = this.state.stanze.find(s => s.id_stanza === stanzaId);
    return stanza ? stanza.nome : '';
  }

  isFormValid(): boolean {
    const formControls = this.bookingForm.controls;
    
    // Check individual required fields
    const hasTipoStanza = !!formControls['tipo_stanza'].value;
    const hasIdStanza = !!formControls['id_stanza'].value;
    const hasIdPostazione = !!formControls['id_postazione'].value;
    const hasSelectedDate = !!formControls['selectedDate'].value || this.state.selectedDates.length > 0;
    const hasTimeSlot = !!formControls['timeSlot'].value;
    const hasSlotDuration = !!formControls['slotDuration'].value;

    // Debug logging only if validation fails
    if (!hasTimeSlot || !hasSlotDuration) {
      console.log('Form validation issue:', {
        hasTimeSlot,
        hasSlotDuration,
        timeSlotValue: formControls['timeSlot'].value,
        slotDurationValue: formControls['slotDuration'].value,
        availableDurations: this.availableDurations,
        availableTimeSlots: this.state.availableTimeSlots.length
      });
    }

    // Check if all required form controls have values
    const hasRequiredFields = 
      hasTipoStanza &&
      hasIdStanza &&
      hasIdPostazione &&
      hasSelectedDate &&
      hasTimeSlot &&
      hasSlotDuration;

    // Check if the form is valid (this includes required field validation)
    const formValid = this.bookingForm.valid;

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
    if (dateValue instanceof Date) {
      console.log('Value is already a Date');
      return dateValue;
    }
    
    if (Array.isArray(dateValue)) {
      try {
        // Array format: [year, month, day, hours, minutes, seconds, nanoseconds]
        const [year, month, day, hours, minutes] = dateValue;
        const date = new Date(year, month - 1, day, hours, minutes);
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
          return date;
        } catch (error) {
          console.error('Error parsing comma-separated date:', error);
          return new Date();
        }
      }
      
      // Prova a parsare la stringa ISO
      try {
        const date = new Date(dateValue);
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
    this.sortedPrenotazioni = this.filteredPrenotazioni.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'data_inizio':
          valueA = new Date(a.data_inizio);
          valueB = new Date(b.data_inizio);
          break;
        case 'utente':
          valueA = `${a.users?.nome || ''} ${a.users?.cognome || ''}`.trim().toLowerCase();
          valueB = `${b.users?.nome || ''} ${b.users?.cognome || ''}`.trim().toLowerCase();
          break;
        case 'stanza':
          valueA = (a.stanze?.nome || '').toLowerCase();
          valueB = (b.stanze?.nome || '').toLowerCase();
          break;
        case 'postazione':
          valueA = (a.postazione?.nomePostazione || '').toLowerCase();
          valueB = (b.postazione?.nomePostazione || '').toLowerCase();
          break;
        case 'stato':
          valueA = a.stato_prenotazione?.toLowerCase() || '';
          valueB = b.stato_prenotazione?.toLowerCase() || '';
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

  setStatusFilter(status: 'tutti' | 'attive' | 'scadute' | 'annullate'): void {
    this.statusFilter = status;
    this.applySorting();
  }

  getStatusFilterCount(status: 'tutti' | 'attive' | 'scadute' | 'annullate'): number {
    if (status === 'tutti') {
      return this.prenotazioni.length;
    }
    
    const now = new Date();
    return this.prenotazioni.filter(prenotazione => {
      switch (status) {
        case 'attive':
          return prenotazione.stato_prenotazione === 'Confermata' && 
                 prenotazione.data_fine > now;
        case 'scadute':
          return prenotazione.data_fine <= now;
        case 'annullate':
          return prenotazione.stato_prenotazione === 'Annullata';
        default:
          return true;
      }
    }).length;
  }

  get filteredPrenotazioni(): Prenotazione[] {
    if (this.statusFilter === 'tutti') {
      return this.prenotazioni;
    }
    
    const now = new Date();
    return this.prenotazioni.filter(prenotazione => {
      switch (this.statusFilter) {
        case 'attive':
          return prenotazione.stato_prenotazione === 'Confermata' && 
                 prenotazione.data_fine > now;
        case 'scadute':
          return prenotazione.data_fine <= now;
        case 'annullate':
          return prenotazione.stato_prenotazione === 'Annullata';
        default:
          return true;
      }
    });
  }

  isFullDayAvailable(): boolean {
    // Controlla se la giornata intera è disponibile negli slot
    const fullDaySlotExists = !!this.state.availableTimeSlots.find(
      slot => slot.startTime === '08:00' && slot.endTime === '18:00'
    );
    
    if (!fullDaySlotExists) {
      return false;
    }
    
    // Se la data selezionata è oggi, controlla se è ancora possibile prenotare la giornata intera
    const selectedDate = this.state.selectedDates[0];
    const today = new Date();
    const isToday = selectedDate && this.isSameDay(selectedDate, today);
    
    if (isToday) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      // La giornata intera inizia alle 08:00, aggiungi margine di 30 minuti
      const fullDayStartInMinutes = 8 * 60; // 08:00 in minuti
      const canBookFullDay = fullDayStartInMinutes > (currentTimeInMinutes + 30);
      return canBookFullDay;
    }
    
    // Per le date future, la giornata intera è disponibile se presente negli slot
    return true;
  }

  getFilteredTimeSlots(): { startTime: string; endTime: string }[] {
    const selectedDuration = this.bookingForm.get('slotDuration')?.value;
    if (!selectedDuration || !this.state.availableTimeSlots.length) {
      return [];
    }

    // Controlla se la data selezionata è oggi
    const selectedDate = this.state.selectedDates[0];
    const today = new Date();
    const isToday = selectedDate && this.isSameDay(selectedDate, today);
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    let filteredSlots = [];

    // Se è selezionata la giornata intera, restituisci solo quello slot
    if (selectedDuration === 'Giornata Intera') {
      filteredSlots = this.state.availableTimeSlots.filter(slot => 
        slot.startTime === '08:00' && slot.endTime === '18:00'
      );
    } else {
      // Per le altre durate, filtra gli slot in base alla durata
      const durationMinutes = this.durationMap[selectedDuration];
      filteredSlots = this.state.availableTimeSlots.filter(slot => {
        const start = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
        const end = parseInt(slot.endTime.split(':')[0]) * 60 + parseInt(slot.endTime.split(':')[1]);
        return (end - start) === durationMinutes;
      });
    }

    // Se è oggi, filtra gli slot che sono già passati
    if (isToday) {
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      filteredSlots = filteredSlots.filter(slot => {
        const slotStartHour = parseInt(slot.startTime.split(':')[0]);
        const slotStartMinute = parseInt(slot.startTime.split(':')[1]);
        const slotStartInMinutes = slotStartHour * 60 + slotStartMinute;
        
        // Aggiungi un margine di sicurezza di 30 minuti per permettere la prenotazione
        const isSlotInFuture = slotStartInMinutes > (currentTimeInMinutes + 30);
        return isSlotInFuture;
      });
    }

    return filteredSlots;
  }

  // Add this new method to handle month changes
  onMonthChange(date: Date): void {
    console.log('Month changed to:', date);
    // No need to check availability anymore since we removed that functionality
  }

  private checkMonthAvailability(date: Date): void {
    // Removed date availability checking
  }

  private checkCurrentMonthAvailability(): void {
    // Removed date availability checking
  }

  private checkDateAvailability(date: Date): void {
    // Removed date availability checking
  }

  private checkSinglePostazioneAvailability(date: Date, postazioneId: number, callback?: (isAvailable: boolean) => void): void {
    // Removed date availability checking
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  isTodaySelected(): boolean {
    if (this.state.selectedDates.length === 0) return false;
    const selectedDate = this.state.selectedDates[0];
    const today = new Date();
    return this.isSameDay(selectedDate, today);
  }

  // Admin and user management methods
  private checkUserRole(): void {
    this.authService.getIdentity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isAdmin = user?.authorities?.includes('ROLE_ADMIN') || false;
        
        if (this.isAdmin) {
          this.loadUsers();
          // For admin, userId is optional (if empty, defaults to themselves)
          this.bookingForm.get('userId')?.clearValidators();
        } else {
          // For regular users, userId is not needed and should be hidden
          this.bookingForm.get('userId')?.clearValidators();
        }
        this.bookingForm.get('userId')?.updateValueAndValidity();
      });
  }

  private loadUsers(): void {
    if (!this.isAdmin) return;
    
    this.adminService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.filteredUsers = users;
        },
        error: (error: Error) => {
          console.error('Errore nel caricamento degli utenti:', error);
          this.showErrorToast('Errore', 'Impossibile caricare la lista degli utenti');
        }
      });
  }

  filterUsers(): void {
    if (!this.userSearchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    const searchTerm = this.userSearchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nome?.toLowerCase().includes(searchTerm) ||
      user.cognome?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      `${user.nome} ${user.cognome}`.toLowerCase().includes(searchTerm)
    );
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.userSearchTerm = `${user.nome} ${user.cognome}`;
    this.bookingForm.patchValue({ userId: user.id_user });
    this.showUserDropdown = false;
  }

  clearUserSearch(): void {
    this.userSearchTerm = '';
    this.selectedUser = null;
    this.bookingForm.patchValue({ userId: '' });
    this.filteredUsers = this.users;
    this.showUserDropdown = false;
  }

  onUserInputBlur(): void {
    // Delay hiding dropdown to allow click events
    setTimeout(() => {
      this.showUserDropdown = false;
    }, 200);
  }

  trackByUser(index: number, user: User): any {
    return user.id_user;
  }

  // Helper methods for cancel functionality
  canCancelPrenotazione(prenotazione: Prenotazione): boolean {
    // Cannot cancel if already canceled
    if (prenotazione.stato_prenotazione === StatoPrenotazione.Annullata) {
      return false;
    }
    
    // Cannot cancel if the booking has already passed
    const now = new Date();
    const bookingDate = new Date(prenotazione.data_fine);
    if (bookingDate <= now) {
      return false;
    }
    
    return true;
  }

  cancelPrenotazione(prenotazione: Prenotazione): void {
    if (!prenotazione.id_prenotazioni) {
      this.showErrorToast('Errore di Sistema', 'Impossibile identificare la prenotazione da annullare');
      return;
    }

    if (!this.canCancelPrenotazione(prenotazione)) {
      this.showWarningToast('Azione non consentita', 'Questa prenotazione non può essere annullata');
      return;
    }

    // Conferma annullamento
    const dataFormatted = this.formatDate(prenotazione.data_inizio, 'dd/MM/yyyy');
    const orarioFormatted = this.getFormattedTimeRange(prenotazione.data_inizio, prenotazione.data_fine);
    const postazioneNome = prenotazione.postazione?.nomePostazione || 'N/A';
    
    const conferma = confirm(
      `Sei sicuro di voler annullare la prenotazione?\n\n` +
      `📅 Data: ${dataFormatted}\n` +
      `⏰ Orario: ${orarioFormatted}\n` +
      `💺 Postazione: ${postazioneNome}\n\n` +
      `La prenotazione verrà contrassegnata come annullata.`
    );

    if (!conferma) {
      return;
    }

    this.state.isLoading = true;
    
    // Show info toast while processing
    this.showInfoToast('Annullamento in corso', 'Stiamo annullando la tua prenotazione...');

    // Update the booking status to 'Annullata'
    this.prenotazionePosizioneService.updatePrenotazione(prenotazione.id_prenotazioni, { 
      stato_prenotazione: StatoPrenotazione.Annullata 
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPrenotazione: Prenotazione) => {
          this.clearAllToasts(); // Clear any existing toasts
          this.showSuccessToast(
            'Prenotazione Annullata', 
            `La prenotazione del ${dataFormatted} è stata annullata con successo`
          );
          
          // Update the local booking list
          const index = this.prenotazioni.findIndex(p => p.id_prenotazioni === prenotazione.id_prenotazioni);
          if (index !== -1) {
            this.prenotazioni[index] = {
              ...this.prenotazioni[index],
              stato_prenotazione: StatoPrenotazione.Annullata
            };
          }
          
          // Update sorted array as well
          this.applySorting();
          this.state.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nell\'annullamento della prenotazione:', error);
          this.clearAllToasts();
          
          let errorMessage = 'Si è verificato un errore durante l\'annullamento della prenotazione';
          if (error.message?.includes('non trovata')) {
            errorMessage = 'La prenotazione non è più disponibile';
          } else if (error.message?.includes('non autorizzato')) {
            errorMessage = 'Non hai i permessi per annullare questa prenotazione';
          }
          
          this.showErrorToast('Errore nell\'Annullamento', errorMessage);
          this.state.isLoading = false;
        }
      });
  }
}
