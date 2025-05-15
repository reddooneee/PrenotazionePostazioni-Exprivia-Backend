import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { LucideAngularModule } from "lucide-angular";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil, Observable } from "rxjs";

import { User } from "@core/models";
import { UserManagementService } from "./user-management.service";
import { UserFormDialogComponent } from "./user-form-dialog.component";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    LucideAngularModule,
    FormsModule,
  ],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ["nome", "cognome", "email", "ruolo", "azioni"];
  dataSource: MatTableDataSource<User>;
  loading$: Observable<boolean>;
  searchTerm = "";
  private destroy$ = new Subject<void>();
  currentFilter: 'all' | 'admin' | 'user' = 'all';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userManagementService: UserManagementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
    this.loading$ = this.userManagementService.loading$;
  }

  ngOnInit(): void {
    this.loadUsers();

    // Sottoscrizione agli utenti filtrati
    this.userManagementService
      .getFilteredUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.dataSource.data = users;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async loadUsers(): Promise<void> {
    try {
      await this.userManagementService.loadUsers();
    } catch (error) {
      this.showErrorMessage("Errore nel caricamento degli utenti");
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    
    // First apply role filter
    this.filterByRole(this.currentFilter);
    
    // Then apply search filter
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async createUser(): Promise<void> {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: "500px",
      data: { title: "Nuovo Utente", user: {} },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.userManagementService.createUser(result);
          this.showSuccessMessage("Utente creato con successo");
        } catch (error) {
          this.showErrorMessage("Errore durante la creazione dell'utente");
        }
      }
    });
  }

  async editUser(user: User): Promise<void> {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: "500px",
      data: { title: "Modifica Utente", user: { ...user } },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.userManagementService.updateUser(user.id_user!, result);
          this.showSuccessMessage("Utente aggiornato con successo");
        } catch (error) {
          this.showErrorMessage("Errore durante l'aggiornamento dell'utente");
        }
      }
    });
  }

  async deleteUser(user: User): Promise<void> {
    if (
      confirm(
        `Sei sicuro di voler eliminare l'utente ${user.nome} ${user.cognome}?`
      )
    ) {
      try {
        await this.userManagementService.deleteUser(user.id_user!);
        this.showSuccessMessage("Utente eliminato con successo");
      } catch (error) {
        this.showErrorMessage("Errore durante l'eliminazione dell'utente");
      }
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, "Chiudi", {
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ["bg-green-600", "text-white"],
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, "Chiudi", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ["bg-red-600", "text-white"],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // User counting methods
  getTotalUsers(): number {
    return this.dataSource.data.length;
  }

  getAdminCount(): number {
    return this.dataSource.data.filter(user => 
      user.authorities?.includes('ROLE_ADMIN')
    ).length;
  }

  getUserCount(): number {
    return this.dataSource.data.filter(user => 
      !user.authorities?.includes('ROLE_ADMIN')
    ).length;
  }

  // Role filtering
  filterByRole(role: 'all' | 'admin' | 'user'): void {
    this.currentFilter = role;
    
    if (role === 'all') {
      this.dataSource.data = this.userManagementService.getOriginalUsers();
    } else {
      const isAdmin = role === 'admin';
      this.dataSource.data = this.userManagementService.getOriginalUsers().filter(user =>
        isAdmin ? user.authorities?.includes('ROLE_ADMIN') : !user.authorities?.includes('ROLE_ADMIN')
      );
    }

    if (this.searchTerm) {
      this.applyFilter({ target: { value: this.searchTerm } } as any);
    }
  }
}
