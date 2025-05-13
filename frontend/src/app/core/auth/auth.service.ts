import { inject, Injectable } from '@angular/core';
import { AuthJwtService } from './auth-jwt.service';
import { AxiosService } from '../../service/axios.service';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIdentity = new BehaviorSubject<User | null>(null);
  private authenticationState = new BehaviorSubject<boolean>(false);
  private accountCacheKey = 'account-cache';
  private userIdentity$ = this.userIdentity.asObservable();
  private authenticationState$ = this.authenticationState.asObservable();

  private authJwtService = inject(AuthJwtService);
  private axiosService = inject(AxiosService);
  private accountUrl = '/api/utenti/current'; // URL per ottenere i dettagli dell'account corrente

  constructor() {
    // Initialize authentication state on service creation
    this.updateIdentity();
  }

  // Aggiorna lo stato di autenticazione
  private updateIdentity(): void {
    if (this.authJwtService.isAuthenticated()) {
      const cachedAccount = this.getCachedAccount();
      if (cachedAccount) {
        this.userIdentity.next(cachedAccount);
        this.authenticationState.next(true);
        // Verify cached account in background
        this.identity(true).subscribe();
      } else {
        this.identity(true).subscribe();
      }
    } else {
      this.authenticate(null);
    }
  }

  // Ottiene l'identità dell'utente dal server
  identity(force = false): Observable<User | null> {
    if (!force && this.authenticationState.value) {
      return this.userIdentity$;
    }

    if (!this.authJwtService.isAuthenticated()) {
      this.authenticate(null);
      return of(null);
    }

    return new Observable<User | null>((observer) => {
      this.axiosService.get<User>(this.accountUrl)
        .then((response: any) => {
          const user = response as User;
          // Verify user has required fields
          if (this.isValidUser(user)) {
            this.authenticate(user);
            this.cacheAccount(user);
            observer.next(user);
          } else {
            console.error('Invalid user data received:', user);
            this.authenticate(null);
            observer.next(null);
          }
          observer.complete();
        })
        .catch((error) => {
          console.error('AuthService: Error fetching user identity:', error);
          this.authenticate(null);
          observer.next(null);
          observer.complete();
        });
    }).pipe(
      catchError(error => {
        console.error('AuthService: Error in identity observable:', error);
        this.authenticate(null);
        return of(null);
      })
    );
  }

  // Verifica se l'oggetto utente è valido
  private isValidUser(user: any): user is User {
    return user &&
           typeof user.nome === 'string' &&
           typeof user.cognome === 'string' &&
           typeof user.email === 'string' &&
           Array.isArray(user.authorities);
  }

  // Autentica l'utente con i dati dell'account
  authenticate(identity: User | null): void {
    console.log('AuthService: Authenticating user:', identity?.email);
    this.userIdentity.next(identity);
    this.authenticationState.next(identity !== null);

    if (!identity) {
      this.clearAccountCache();
    }
  }

  // Verifica se l'utente ha l'autorità specificata
  hasAnyAuthority(authorities: string[]): boolean {
    const account = this.userIdentity.value;
    
    if (!account || !account.authorities) {
      return false;
    }

    return authorities.some(authority => account.authorities?.includes(authority));
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    return this.authenticationState.value && this.authJwtService.isAuthenticated();
  }

  // Sottoscrizione alle modifiche dello stato di autenticazione
  getAuthenticationState(): Observable<boolean> {
    return this.authenticationState$;
  }

  // Ottiene l'identità corrente dell'utente
  getIdentity(): Observable<User | null> {
    return this.userIdentity$;
  }

  // Gestione della cache dell'account
  private cacheAccount(account: User): void {
    if (account) {
      try {
        localStorage.setItem(this.accountCacheKey, JSON.stringify(account));
      } catch (error) {
        console.error('Error caching account:', error);
      }
    }
  }

  private getCachedAccount(): User | null {
    try {
      const cachedAccount = localStorage.getItem(this.accountCacheKey);
      if (!cachedAccount) return null;
      
      const account = JSON.parse(cachedAccount) as User;
      return this.isValidUser(account) ? account : null;
    } catch (error) {
      console.error('Error reading cached account:', error);
      return null;
    }
  }

  private clearAccountCache(): void {
    try {
      localStorage.removeItem(this.accountCacheKey);
    } catch (error) {
      console.error('Error clearing account cache:', error);
    }
  }
}
