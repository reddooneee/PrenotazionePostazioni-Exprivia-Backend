import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, firstValueFrom } from 'rxjs';
import { User } from '@core/models';
import { AdminService } from '@core/services';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private users: User[] = [];
  private filteredUsers = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private searchTermSubject = new BehaviorSubject<string>('');

  private filteredUsers$ = combineLatest([
    this.filteredUsers.asObservable(),
    this.searchTermSubject.asObservable()
  ]).pipe(
    map(([users, searchTerm]) => {
      if (!searchTerm.trim()) {
        return users;
      }
      const searchLower = searchTerm.toLowerCase();
      return users.filter(user => 
        user.nome.toLowerCase().includes(searchLower) ||
        user.cognome.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    })
  );

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private adminService: AdminService) {}

  getOriginalUsers(): User[] {
    return [...this.users];
  }

  // Carica tutti gli utenti
  async loadUsers(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const users = await firstValueFrom(this.adminService.getAllUsers());
      this.users = users;
      this.filteredUsers.next(users);
    } catch (error) {
      console.error('Errore nel caricamento degli utenti:', error);
      this.filteredUsers.next([]);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Filtra gli utenti in base al termine di ricerca
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term.toLowerCase());
  }

  // Ottieni gli utenti filtrati
  getFilteredUsers(): Observable<User[]> {
    return this.filteredUsers$;
  }

  // Ottieni tutti gli utenti non filtrati
  getAllUsers(): Observable<User[]> {
    return this.filteredUsers.asObservable();
  }

  // Crea un nuovo utente
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      this.loadingSubject.next(true);
      const newUser = await firstValueFrom(this.adminService.createUser(userData));
      await this.loadUsers(); // Ricarica la lista dopo la creazione
      return newUser;
    } catch (error) {
      console.error('Errore durante la creazione dell\'utente:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Aggiorna un utente esistente
  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      this.loadingSubject.next(true);
      const updatedUser = await firstValueFrom(this.adminService.updateUser(userId, userData));
      await this.loadUsers(); // Ricarica la lista dopo l'aggiornamento
      return updatedUser;
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'utente:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Elimina un utente
  async deleteUser(userId: number): Promise<void> {
    try {
      this.loadingSubject.next(true);
      await firstValueFrom(this.adminService.deleteUser(userId));
      await this.loadUsers(); // Ricarica la lista dopo l'eliminazione
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'utente:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Ottieni un utente per ID
  async getUserById(userId: number): Promise<User> {
    try {
      this.loadingSubject.next(true);
      return await firstValueFrom(this.adminService.getUserById(userId));
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente:', error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }
} 