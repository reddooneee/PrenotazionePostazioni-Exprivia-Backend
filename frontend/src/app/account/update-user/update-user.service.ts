import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { AuthJwtService } from '../../core/auth/auth-jwt.service';
import { User } from '../../core/models';

export interface UpdateUserRequest {
  nome?: string;
  cognome?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {
  constructor(
    private userService: UserService,
    private authJwtService: AuthJwtService
  ) {}

  /**
   * Aggiorna i dati dell'utente
   * @param userId ID dell'utente da aggiornare
   * @param updates Dati da aggiornare
   * @returns Observable con l'utente aggiornato
   */
  updateUser(userId: number, updates: UpdateUserRequest): Observable<User> {
    // Se c'è una nuova password, verifica prima la password attuale
    if (updates.newPassword && updates.currentPassword) {
      return this.authJwtService.login({ email: updates.email || '', password: updates.currentPassword }).pipe(
        switchMap(() => {
          // Se il login ha successo, procedi con l'aggiornamento
          const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
          );
          return this.userService.updateUser(userId, cleanUpdates);
        }),
        map(response => response as User),
        catchError(error => {
          let errorMessage = 'Si è verificato un errore durante l\'aggiornamento del profilo.';
          
          if (error.response?.data) {
            errorMessage = error.response.data;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
    }

    // Se non c'è una nuova password, procedi direttamente con l'aggiornamento
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    return this.userService.updateUser(userId, cleanUpdates).pipe(
      map(response => response as User),
      catchError(error => {
        let errorMessage = 'Si è verificato un errore durante l\'aggiornamento del profilo.';
        
        if (error.response?.data) {
          errorMessage = error.response.data;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Valida i dati di aggiornamento
   * @param updates Dati da validare
   * @returns Oggetto con eventuali errori di validazione
   */
  validateUpdates(updates: UpdateUserRequest): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (updates['nome'] && updates['nome'].trim().length < 2) {
      errors['nome'] = 'Il nome deve contenere almeno 2 caratteri';
    }

    if (updates['cognome'] && updates['cognome'].trim().length < 2) {
      errors['cognome'] = 'Il cognome deve contenere almeno 2 caratteri';
    }

    if (updates['email']) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(updates['email'])) {
        errors['email'] = 'Inserisci un indirizzo email valido';
      }
    }

    if (updates['newPassword']) {
      if (updates['newPassword'].length < 8) {
        errors['newPassword'] = 'La password deve contenere almeno 8 caratteri';
      }
      if (!updates['currentPassword']) {
        errors['currentPassword'] = 'Inserisci la password attuale per cambiare la password';
      }
    }

    if (updates['currentPassword'] && !updates['newPassword']) {
      errors['newPassword'] = 'Inserisci la nuova password';
    }

    return errors;
  }
} 