import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../shared/services/toast.service';
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
  providers: [DatePipe],
  templateUrl: './user-bookings.component.html',
  styleUrls: ['../../../shared/styles/toast.styles.css']
})
export class UserBookingsComponent implements OnInit, OnDestroy {
  prenotazioni: Prenotazione[] = [];
  filteredPrenotazioni: Prenotazione[] = [];
  paginatedPrenotazioni: Prenotazione[] = [];
  isLoading = false;
  isAdmin = false;
  private destroy$ = new Subject<void>();

  // Sorting properties
  sortColumn: string = 'data_inizio'; // Default sort by date
  sortDirection: 'asc' | 'desc' = 'desc'; // Default to descending (latest first)

  // Search properties
  searchTerm: string = '';

  // Filter properties
  statusFilter: 'tutti' | 'attive' | 'scadute' | 'annullate' = 'attive'; // Default to active

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

  // Edit modal properties
  showEditModal = false;
  isEditLoading = false;
  editErrorMessage = '';
  editForm: FormGroup;
  editingPrenotazione: Prenotazione | null = null;
  openDropdownId: number | null = null;

  // Data for dropdowns
  users: User[] = [];
  stanze: StanzaWithPostazioni[] = [];
  tipiStanza: string[] = [];
  filteredStanze: StanzaWithPostazioni[] = [];
  filteredPostazioni: Postazione[] = [];

  // User search properties
  userSearchTerm: string = '';
  filteredUsers: User[] = [];
  showUserDropdown: boolean = false;
  selectedUser: User | null = null;

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
    private toastService: ToastService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private adminService: AdminService,
    private stanzaService: StanzaService,
    private postazioneService: PostazioneService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      userId: [''],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      tipoStanza: ['', Validators.required],
      stanzaId: ['', Validators.required],
      postazioneId: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      stato_prenotazione: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadPrenotazioni();
    this.loadModalData();
    this.setupFormSubscriptions();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target as Element).closest('.relative')) {
        this.openDropdownId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Remove event listener
    document.removeEventListener('click', () => {});
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
          }));
          // Apply sorting after loading data
          this.applySorting();
          
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nel caricamento delle prenotazioni:', error);
          let errorMessage = 'Si è verificato un errore durante il caricamento delle prenotazioni';
          if (error.message?.includes('non autorizzato')) {
            errorMessage = 'Non hai i permessi per accedere a queste prenotazioni';
          } else if (error.message?.includes('timeout')) {
            errorMessage = 'Il caricamento sta richiedendo troppo tempo. Riprova tra poco';
          }
          this.showErrorToast('Errore di Caricamento', errorMessage);
          this.isLoading = false;
        }
      });
  }

  deletePrenotazione(prenotazione: Prenotazione): void {
    this.openDropdownId = null; // Close dropdown
    
    if (!prenotazione || !prenotazione.id_prenotazioni) {
      console.error('Prenotazione non valida');
      this.showErrorToast('Errore', 'Prenotazione non valida');
      return;
    }

    const dataFormatted = this.formatDate(prenotazione.data_inizio, 'dd/MM/yyyy');
    
    if (!confirm(`Sei sicuro di voler eliminare la prenotazione del ${dataFormatted}?`)) {
      return;
    }

    this.isLoading = true;

    this.prenotazioneService.deletePrenotazione(prenotazione.id_prenotazioni)
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
          // Apply sorting after deletion
          this.applySorting();
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Errore nell\'eliminazione della prenotazione:', error);
          this.clearAllToasts();
          
          let errorMessage = 'Si è verificato un errore durante l\'eliminazione della prenotazione';
          if (error.message?.includes('non trovata')) {
            errorMessage = 'La prenotazione non è più disponibile o è già stata eliminata';
          } else if (error.message?.includes('non autorizzato')) {
            errorMessage = 'Non hai i permessi per eliminare questa prenotazione';
          } else if (error.message?.includes('timeout')) {
            errorMessage = 'L\'operazione sta richiedendo troppo tempo. Riprova tra poco';
          }
          
          this.showErrorToast('Errore nell\'Eliminazione', errorMessage);
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

  // Navigation method (replaces modal)
  openNewBookingModal(): void {
    // Navigate to the prenota-posizione page which has a better interface
    this.router.navigate(['/dashboard/prenota-posizione']);
  }

  closeModal(): void {
    this.showModal = false;
    this.modalErrorMessage = '';
    this.bookingForm.reset();
    this.clearUserSearch();
  }

  // User search methods
  filterUsers(): void {
    if (!this.userSearchTerm.trim()) {
      this.filteredUsers = this.users;
      this.showUserDropdown = this.users.length > 0;
      return;
    }

    const searchLower = this.userSearchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      `${user.nome} ${user.cognome}`.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
    this.showUserDropdown = true;
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
    this.filteredUsers = [];
    this.showUserDropdown = false;
    this.bookingForm.patchValue({ userId: '' });
  }

  onUserInputBlur(): void {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      this.showUserDropdown = false;
    }, 200);
  }

  trackByUser(index: number, user: User): any {
    return user.id_user || index;
  }

  private loadModalData(): void {
    // Load users for admin
    if (this.isAdmin) {
      this.adminService.getAllUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users: User[]) => {
            this.users = users;
            this.filteredUsers = users;
          },
          error: (error: any) => {
            console.error('Error loading users:', error);
            this.showErrorToast(
              'Errore di Caricamento',
              'Impossibile caricare la lista degli utenti. Riprova più tardi'
            );
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
          this.showErrorToast(
            'Errore di Caricamento',
            'Impossibile caricare le stanze disponibili. Riprova più tardi'
          );
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
      this.showWarningToast(
        'Campi Obbligatori',
        'Completa tutti i campi richiesti prima di procedere'
      );
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
          this.clearAllToasts();
          this.showSuccessToast(
            'Prenotazione Creata',
            `La prenotazione per il ${this.formatDate(startDateTime, 'dd/MM/yyyy')} è stata creata con successo`
          );
          this.closeModal();
          this.loadPrenotazioni(); // Reload the list
          this.isModalLoading = false;
        },
        error: (error) => {
          console.error('Error creating prenotazione:', error);
          this.clearAllToasts();
          
          let errorMessage = 'Si è verificato un errore durante la creazione della prenotazione';
          if (error.message?.includes('già prenotata')) {
            errorMessage = 'La postazione è già prenotata per l\'orario selezionato';
          } else if (error.message?.includes('non disponibile')) {
            errorMessage = 'La postazione non è disponibile per l\'orario selezionato';
          } else if (error.message?.includes('non autorizzato')) {
            errorMessage = 'Non hai i permessi per creare questa prenotazione';
          } else if (error.message?.includes('timeout')) {
            errorMessage = 'L\'operazione sta richiedendo troppo tempo. Riprova tra poco';
          }
          
          this.modalErrorMessage = errorMessage;
          this.showErrorToast('Errore nella Creazione', errorMessage);
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

  // Search method
  applySearchFilter(): void {
    this.applyFilters();
  }

  applyStatusFilter(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.prenotazioni];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(prenotazione => {
        const userName = `${prenotazione.users?.nome || ''} ${prenotazione.users?.cognome || ''}`.toLowerCase();
        const userEmail = (prenotazione.users?.email || '').toLowerCase();
        const stanzaNome = (prenotazione.stanze?.nome || '').toLowerCase();
        const stanzaTipo = (prenotazione.stanze?.tipo_stanza || '').toLowerCase();
        const postazioneName = (prenotazione.postazione?.nomePostazione || '').toLowerCase();
        const dataFormatted = this.formatDate(prenotazione.data_inizio, 'dd/MM/yyyy').toLowerCase();
        
        return userName.includes(searchLower) ||
               userEmail.includes(searchLower) ||
               stanzaNome.includes(searchLower) ||
               stanzaTipo.includes(searchLower) ||
               postazioneName.includes(searchLower) ||
               dataFormatted.includes(searchLower);
      });
    }

    // Apply status filter
    if (this.statusFilter !== 'tutti') {
      const now = new Date();
      filtered = filtered.filter(prenotazione => {
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

    this.filteredPrenotazioni = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagination();
  }

  setStatusFilter(status: 'tutti' | 'attive' | 'scadute' | 'annullate'): void {
    this.statusFilter = status;
    this.applyStatusFilter();
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

  private applySorting(): void {
    // Apply filters first
    this.applyFilters();
    
    // Then apply sorting to filtered data
    this.filteredPrenotazioni.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortColumn) {
        case 'data_inizio':
          aValue = new Date(a.data_inizio).getTime();
          bValue = new Date(b.data_inizio).getTime();
          break;
        case 'utente':
          aValue = `${a.users?.nome || ''} ${a.users?.cognome || ''}`.toLowerCase();
          bValue = `${b.users?.nome || ''} ${b.users?.cognome || ''}`.toLowerCase();
          break;
        case 'stanza':
          aValue = (a.stanze?.nome || '').toLowerCase();
          bValue = (b.stanze?.nome || '').toLowerCase();
          break;
        case 'postazione':
          aValue = (a.postazione?.nomePostazione || '').toLowerCase();
          bValue = (b.postazione?.nomePostazione || '').toLowerCase();
          break;
        case 'stato':
          aValue = a.stato_prenotazione?.toLowerCase() || '';
          bValue = b.stato_prenotazione?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    this.updatePaginatedData();
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

  private updatePaginatedData(): void {
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

  toggleDropdown(prenotazioneId: number): void {
    if (!prenotazioneId) {
      return;
    }
    this.openDropdownId = this.openDropdownId === prenotazioneId ? null : prenotazioneId;
  }

  shouldOpenUpward(prenotazioneId: number): boolean {
    // Use a simple heuristic: check if we're in the last few rows of the table
    const index = this.paginatedPrenotazioni.findIndex(p => p.id_prenotazioni === prenotazioneId);
    const totalItems = this.paginatedPrenotazioni.length;
    
    // If we're in the last 2 items of the current page, open upward
    if (index >= totalItems - 2) {
      return true;
    }

    // Also check viewport position as backup
    try {
      const buttonElement = document.querySelector(`[data-prenotazione-id="${prenotazioneId}"]`) as HTMLElement;
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        return rect.bottom > viewportHeight - 120; // 120px buffer for dropdown
      }
    } catch (error) {
      // Fallback to index-based logic
    }
    
    return false;
  }

  editPrenotazione(prenotazione: Prenotazione): void {
    this.editingPrenotazione = prenotazione;
    this.editForm.patchValue({
      stato_prenotazione: prenotazione.stato_prenotazione
    });
    this.editErrorMessage = '';
    this.showEditModal = true;
    this.openDropdownId = null; // Close dropdown
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingPrenotazione = null;
    this.editErrorMessage = '';
    this.editForm.reset();
  }

  onSubmitEdit(): void {
    if (this.editForm.invalid || !this.editingPrenotazione) {
      return;
    }

    this.isEditLoading = true;
    this.editErrorMessage = '';

    const updatedStatus = this.editForm.get('stato_prenotazione')?.value;
    const prenotazioneId = this.editingPrenotazione.id_prenotazioni;

    if (!prenotazioneId) {
      this.editErrorMessage = 'ID prenotazione non valido';
      this.isEditLoading = false;
      return;
    }

    // Create updated prenotazione object
    const updatedPrenotazione = {
      ...this.editingPrenotazione,
      stato_prenotazione: updatedStatus
    };

    this.prenotazioneService.updatePrenotazione(prenotazioneId, updatedPrenotazione)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.clearAllToasts();
          this.showSuccessToast(
            'Prenotazione Aggiornata',
            `Lo stato della prenotazione è stato cambiato in "${updatedStatus}"`
          );
          
          // Update the prenotazione in the local array
          const index = this.prenotazioni.findIndex(p => p.id_prenotazioni === this.editingPrenotazione!.id_prenotazioni);
          if (index !== -1) {
            this.prenotazioni[index].stato_prenotazione = updatedStatus as StatoPrenotazione;
          }
          
          this.applySorting();
          this.closeEditModal();
          this.isEditLoading = false;
        },
        error: (error) => {
          console.error('Error updating prenotazione:', error);
          this.clearAllToasts();
          
          let errorMessage = 'Si è verificato un errore durante l\'aggiornamento della prenotazione';
          if (error.message?.includes('non trovata')) {
            errorMessage = 'La prenotazione non è più disponibile';
          } else if (error.message?.includes('non autorizzato')) {
            errorMessage = 'Non hai i permessi per modificare questa prenotazione';
          } else if (error.message?.includes('timeout')) {
            errorMessage = 'L\'operazione sta richiedendo troppo tempo. Riprova tra poco';
          }
          
          this.editErrorMessage = errorMessage;
          this.showErrorToast('Errore nell\'Aggiornamento', errorMessage);
          this.isEditLoading = false;
        }
      });
  }
} 