import { inject, Injectable } from '@angular/core';
import { AuthJwtService } from './auth-jwt.service';
import { AxiosService } from '../../service/axios.service';
import { BehaviorSubject, Observable } from 'rxjs';
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

    return new Observable<User | null>((observer) => {
      if (!this.authJwtService.isAuthenticated()) {
        this.authenticate(null);
        observer.next(null);
        observer.complete();
        return;
      }

      this.axiosService.get<User>(this.accountUrl)
        .then((response: any) => {
          const user = response as User;
          this.authenticate(user);
          this.cacheAccount(user);
          observer.next(user);
          observer.complete();
        })
        .catch((error) => {
          this.authenticate(null);
          observer.next(null);
          observer.complete();
        });
    });
  }

  // Autentica l'utente con i dati dell'account
  authenticate(identity: User | null): void {
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
    const isAuthenticated = this.authenticationState.value;
    return isAuthenticated;
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
      localStorage.setItem(this.accountCacheKey, JSON.stringify(account));
    }
  }

  private getCachedAccount(): User | null {
    const cachedAccount = localStorage.getItem(this.accountCacheKey);
    return cachedAccount ? JSON.parse(cachedAccount) : null;
  }

  private clearAccountCache(): void {
    localStorage.removeItem(this.accountCacheKey);
  }
}
