import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AxiosService } from '../../service/axios.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly registerEndpoint = '/auth/register';
  private readonly loginEndpoint = '/auth/login';
  private readonly forgotPwdEndpoint = '/auth/forgot-password';
  private readonly resetPwdEndpoint = '/auth/reset-password';

  constructor(private readonly axiosService: AxiosService) { }

  /**
   * Registra un nuovo utente
   * @param user L'utente da registrare
   * @returns Observable con la risposta del server
   */
  registerUser(user: User): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.registerEndpoint, user)
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  /**
   * Effettua il login dell'utente e salva il token JWT
   * @param email L'email dell'utente
   * @param password La password dell'utente
   * @returns Observable con la risposta del server
   */
  loginUser(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return new Observable((observer) => {
      this.axiosService.post(this.loginEndpoint, credentials)
        .then((response) => {
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
            observer.next(response);
            observer.complete();
          } else {
            observer.error('Login fallito');
          }
        })
        .catch((error) => {
          observer.error('Credenziali errate');
        });
    });
  }

  /**
   * Effettua il logout dell'utente
   */
  logoutUser(): void {
    localStorage.removeItem('jwt_token');
  }

  /**
   * Invia una richiesta di recupero password
   * @param email L'email dell'utente
   * @returns Observable con la risposta del server
   */
  forgotPassword(email: string): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.forgotPwdEndpoint, { email })
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  /**
   * Reset della password
   * @param token Il token di reset
   * @param newPassword La nuova password
   * @returns Observable con la risposta del server
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.resetPwdEndpoint, {
        token,
        newPassword
      })
      .then((response) => {
        observer.next(response);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
    });
  }

  /**
   * Ottiene il token JWT salvato nel localStorage
   * @returns Il token JWT o null se non presente
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Verifica se l'utente è autenticato
   * @returns true se l'utente è autenticato, false altrimenti
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Estrae i ruoli dall'JWT
   * @returns Un array di ruoli estratti dal token
   */
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      return [];
    }

    try {
      const decodedToken: any = jwt_decode(token);
      return decodedToken.roles || decodedToken.authorities || [];
    } catch (error) {
      console.error('Errore nella decodifica del JWT', error);
      return [];
    }
  }

  /**
   * Verifica se l'utente ha un determinato ruolo
   * @param role Il ruolo da verificare
   * @returns true se l'utente ha il ruolo, false altrimenti
   */
  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  /**
   * Memorizza il token JWT nel localStorage
   * @param token Il token JWT da memorizzare
   */
  private storeToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }
}

function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}

