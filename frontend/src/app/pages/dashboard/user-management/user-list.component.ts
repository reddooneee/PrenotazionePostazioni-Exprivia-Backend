import {
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil, Observable } from "rxjs";
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../shared/services/toast.service';

import { User } from "@core/models";
import { UserManagementService } from "./user-management.service";
import { UserFormDialogComponent } from "./user-form-dialog.component";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  standalone: true,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    /* Prevent layout shift by always reserving scrollbar space */
    :host ::ng-deep body {
      overflow-y: scroll;
    }
  `],
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    UserFormDialogComponent,
    ToastModule,
  ],
  providers: [],
  styleUrls: ['../../../shared/styles/toast.styles.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  loading$: Observable<boolean>;
  searchTerm = "";
  private destroy$ = new Subject<void>();
  currentFilter: 'all' | 'admin' | 'user' = 'all';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 25;
  totalItems = 0;
  totalPages = 0;
  pageOptions = [10, 25, 50, 100];
  
  // Pagination helper arrays
  pageNumbers: number[] = [];

  // Modal state
  showModal = false;
  isModalLoading = false;
  modalData: { title: string; user: Partial<User> } = { title: '', user: {} };

  constructor(
    private userManagementService: UserManagementService,
    private toastService: ToastService
  ) {
    this.loading$ = this.userManagementService.loading$;
  }

  ngOnInit(): void {
    this.loadUsers();

    // Initialize pagination
    this.updatePagination();

    // Sottoscrizione agli utenti filtrati
    this.userManagementService
      .getFilteredUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        this.applyCurrentFilter();
      });
  }

  async loadUsers(): Promise<void> {
    try {
      await this.userManagementService.loadUsers();
    } catch (error) {
      this.toastService.showError("Errore di Caricamento", "Errore nel caricamento degli utenti");
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.applyCurrentFilter();
  }

  private applyCurrentFilter(): void {
    // Start with all users
    let filtered = [...this.users];

    // Apply role filter
    if (this.currentFilter === 'admin') {
      filtered = filtered.filter(user => user.authorities?.includes('ROLE_ADMIN'));
    } else if (this.currentFilter === 'user') {
      filtered = filtered.filter(user => !user.authorities?.includes('ROLE_ADMIN'));
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.nome?.toLowerCase().includes(searchLower) ||
        user.cognome?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredUsers = filtered;
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagination();
  }

  createUser(): void {
    this.modalData = { title: "Nuovo Utente", user: {} };
    this.showModal = true;
  }

  async onModalSubmit(userData: any): Promise<void> {
    if (!userData) {
      this.closeModal();
      return;
    }

    try {
      this.isModalLoading = true;
      if (this.modalData.user.id_user) {
        // Edit mode
        await this.userManagementService.updateUser(this.modalData.user.id_user!, userData);
        this.toastService.showSuccess("Utente Aggiornato", "Utente aggiornato con successo");
      } else {
        // Create mode
        await this.userManagementService.createUser(userData);
        this.toastService.showSuccess("Utente Creato", "Utente creato con successo");
      }
      this.closeModal();
    } catch (error) {
      this.toastService.showError("Errore Operazione", this.modalData.user.id_user ? "Errore durante l'aggiornamento dell'utente" : "Errore durante la creazione dell'utente");
    } finally {
      this.isModalLoading = false;
    }
  }

  editUser(user: User): void {
    this.modalData = { title: "Modifica Utente", user: { ...user } };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isModalLoading = false;
    this.modalData = { title: '', user: {} };
  }

  async deleteUser(user: User): Promise<void> {
    if (
      confirm(
        `Sei sicuro di voler eliminare l'utente ${user.nome} ${user.cognome}?`
      )
    ) {
      try {
        await this.userManagementService.deleteUser(user.id_user!);
        this.toastService.showSuccess("Utente Eliminato", "Utente eliminato con successo");
      } catch (error) {
        this.toastService.showError("Errore Eliminazione", "Errore durante l'eliminazione dell'utente");
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // User counting methods
  getTotalUsers(): number {
    return this.users.length;
  }

  getAdminCount(): number {
    return this.users.filter(user => 
      user.authorities?.includes('ROLE_ADMIN')
    ).length;
  }

  getUserCount(): number {
    return this.users.filter(user => 
      !user.authorities?.includes('ROLE_ADMIN')
    ).length;
  }

  // Role filtering
  filterByRole(role: 'all' | 'admin' | 'user'): void {
    this.currentFilter = role;
    this.applyCurrentFilter();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    
    // Calculate start and end indices
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Get paginated items
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
    
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
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}

