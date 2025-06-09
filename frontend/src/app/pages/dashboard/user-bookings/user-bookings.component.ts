import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Prenotazione, StatoPrenotazione, PrenotazioneRequest } from '@core/models/prenotazione.model';
import { PrenotazioneService } from '@core/services/prenotazione.service';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/models';
import { AdminService } from '@core/services/admin.service';
import { StanzaService } from '@core/services/stanza.service';
import { PostazioneService } from '@core/services/postazione.service';
import { Stanza, StanzaWithPostazioni } from '@core/models/stanza.model';
import { Postazione } from '@core/models/postazione.model';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, ToastModule],
  providers: [MessageService, DatePipe],
  templateUrl: './user-bookings.component.html',
})
export class UserBookingsComponent implements OnInit, OnDestroy {
  prenotazioni: Prenotazione[] = [];
  filteredPrenotazioni: Prenotazione[] = [];
  paginatedPrenotazioni: Prenotazione[] = [];
  isLoading = false;
  isAdmin = false;
  private destroy$ = new Subject<void>();

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 25;
  totalItems = 0;
  totalPages = 0;
  pageOptions = [10, 25, 50, 100];
  
  // Pagination helper arrays
  pageNumbers: number[] = [];

  // Modal properties
  showModal = false;
  isModalLoading = false;
  modalErrorMessage = '';
  bookingForm: FormGroup;

  // Data for dropdowns
  users: User[] = [];
  stanze: StanzaWithPostazioni[] = [];
  tipiStanza: string[] = [];
  filteredStanze: StanzaWithPostazioni[] = [];
  filteredPostazioni: Postazione[] = [];

  // Time slots
  timeSlots = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' }
  ];

  constructor(
    private prenotazioneService: PrenotazioneService,
    private authService: AuthService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private adminService: AdminService,
    private stanzaService: StanzaService,
    private postazioneService: PostazioneService
  ) {
    this.bookingForm = this.fb.group({
      userId: [''],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      tipoStanza: ['', Validators.required],
      stanzaId: ['', Validators.required],
      postazioneId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadPrenotazioni();
    this.loadModalData();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkUserRole(): void {
    this.authService.getIdentity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isAdmin = user?.authorities?.includes('ROLE_ADMIN') || false;
        
        // Update form validation based on admin role
        if (this.isAdmin) {
          this.bookingForm.get('userId')?.setValidators([Validators.required]);
        } else {
          this.bookingForm.get('userId')?.clearValidators();
        }
        this.bookingForm.get('userId')?.updateValueAndValidity();
      });
  }

  loadPrenotazioni(): void {
    this.isLoading = true;
    
    // If admin, load all prenotazioni, otherwise load only user's prenotazioni
    const prenotazioniObservable = this.isAdmin 
      ? this.prenotazioneService.getPrenotazioni()
      : this.prenotazioneService.getMiePrenotazioni();

    prenotazioniObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prenotazioni: Prenotazione[]) => {
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
          })).sort((a, b) => {
            // Sort by latest date first (descending order)
            const dateA = new Date(a.data_inizio);
            const dateB = new Date(b.data_inizio);
            return dateB.getTime() - dateA.getTime();
          });
          this.filteredPrenotazioni = [...this.prenotazioni];
          this.updatePagination();
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nel caricamento delle prenotazioni:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: 'Errore nel caricamento delle prenotazioni'
          });
          this.isLoading = false;
        }
      });
  }

  deletePrenotazione(prenotazione: Prenotazione): void {
    if (!prenotazione.id_prenotazioni) {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore',
        detail: 'ID prenotazione non valido'
      });
      return;
    }

    // Conferma eliminazione
    const conferma = confirm(
      `Sei sicuro di voler eliminare la prenotazione del ${this.formatDate(prenotazione.data_inizio, 'dd/MM/yyyy')} alle ${this.getFormattedTimeRange(prenotazione.data_inizio, prenotazione.data_fine)}?`
    );

    if (!conferma) {
      return;
    }

    this.isLoading = true;

    this.prenotazioneService.deletePrenotazione(prenotazione.id_prenotazioni)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successo',
            detail: 'Prenotazione eliminata con successo'
          });
          
          // Rimuovi la prenotazione dalla lista locale
          this.prenotazioni = this.prenotazioni.filter(p => p.id_prenotazioni !== prenotazione.id_prenotazioni);
          this.filteredPrenotazioni = [...this.prenotazioni];
          this.updatePagination();
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nell\'eliminazione della prenotazione:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: error.message || 'Errore nell\'eliminazione della prenotazione'
          });
          this.isLoading = false;
        }
      });
  }

  private parseDate(dateValue: any): Date {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    if (Array.isArray(dateValue)) {
      try {
        // Array format: [year, month, day, hours, minutes, seconds, nanoseconds]
        const [year, month, day, hours, minutes] = dateValue;
        return new Date(year, month - 1, day, hours, minutes);
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
          return new Date(year, month - 1, day, hours, minutes);
        } catch (error) {
          console.error('Error parsing comma-separated date:', error);
          return new Date();
        }
      }
      
      // Prova a parsare la stringa ISO
      try {
        return new Date(dateValue);
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

  trackByPrenotazione(index: number, prenotazione: Prenotazione): any {
    return prenotazione.id_prenotazioni || index;
  }



  // Modal methods
  openNewBookingModal(): void {
    this.showModal = true;
    this.modalErrorMessage = '';
    this.bookingForm.reset();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    this.bookingForm.patchValue({ date: today });
  }

  closeModal(): void {
    this.showModal = false;
    this.modalErrorMessage = '';
    this.bookingForm.reset();
  }

  private loadModalData(): void {
    // Load users for admin
    if (this.isAdmin) {
      this.adminService.getAllUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users: User[]) => {
            this.users = users;
          },
          error: (error: any) => {
            console.error('Error loading users:', error);
          }
        });
    }

    // Load stanze
    this.stanzaService.getStanzeWithPostazioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stanze) => {
          this.stanze = stanze;
          this.tipiStanza = [...new Set(stanze.map(s => s.tipo_stanza))];
        },
        error: (error) => {
          console.error('Error loading stanze:', error);
        }
      });
  }

  private setupFormSubscriptions(): void {
    // Watch for room type changes
    this.bookingForm.get('tipoStanza')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipoStanza => {
        if (tipoStanza) {
          this.filteredStanze = this.stanze.filter(s => s.tipo_stanza === tipoStanza);
        } else {
          this.filteredStanze = [];
        }
        this.bookingForm.patchValue({ stanzaId: '', postazioneId: '' });
        this.filteredPostazioni = [];
      });

    // Watch for room changes
    this.bookingForm.get('stanzaId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(stanzaId => {
        if (stanzaId) {
          const selectedStanza = this.stanze.find(s => s.id_stanza === +stanzaId);
          this.filteredPostazioni = selectedStanza?.postazioni || [];
        } else {
          this.filteredPostazioni = [];
        }
        this.bookingForm.patchValue({ postazioneId: '' });
      });
  }

  onSubmitModal(): void {
    if (!this.bookingForm.valid) {
      this.modalErrorMessage = 'Compila tutti i campi richiesti';
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isModalLoading = true;
    this.modalErrorMessage = '';

    const formData = this.bookingForm.value;
    const selectedDate = new Date(formData.date);
    const [startHour, startMinute] = formData.timeSlot.split(' - ')[0].split(':');
    const [endHour, endMinute] = formData.timeSlot.split(' - ')[1].split(':');

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

    // Format dates for API
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const prenotazioneRequest: PrenotazioneRequest = {
      id_postazione: parseInt(formData.postazioneId),
      id_stanza: parseInt(formData.stanzaId),
      data_inizio: formatDate(startDateTime),
      data_fine: formatDate(endDateTime)
    };

    // Choose the appropriate service method based on user role and form data
    const serviceCall = this.isAdmin && formData.userId
      ? this.prenotazioneService.createPrenotazioneAdmin({
          ...prenotazioneRequest,
          id_user: parseInt(formData.userId)
        })
      : this.prenotazioneService.createPrenotazione(prenotazioneRequest);

    serviceCall
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successo',
            detail: 'Prenotazione creata con successo'
          });
          this.closeModal();
          this.loadPrenotazioni(); // Reload the list
          this.isModalLoading = false;
        },
        error: (error) => {
          console.error('Error creating prenotazione:', error);
          this.modalErrorMessage = error.message || 'Errore nella creazione della prenotazione';
          this.isModalLoading = false;
        }
      });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredPrenotazioni.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    
    // Calculate start and end indices
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Get paginated items
    this.paginatedPrenotazioni = this.filteredPrenotazioni.slice(startIndex, endIndex);
    
    // Generate page numbers for pagination controls
    this.generatePageNumbers();
  }

  generatePageNumbers(): void {
    const maxVisiblePages = 5;
    this.pageNumbers = [];
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  goToFirstPage(): void {
    this.onPageChange(1);
  }

  goToLastPage(): void {
    this.onPageChange(this.totalPages);
  }

  goToPreviousPage(): void {
    this.onPageChange(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.onPageChange(this.currentPage + 1);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
} 