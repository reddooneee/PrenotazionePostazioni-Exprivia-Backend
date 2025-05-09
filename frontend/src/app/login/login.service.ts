import { inject, Injectable } from '@angular/core';
import { mergeMap, Observable, tap, finalize } from 'rxjs';
import { AuthJwtService } from '../core/auth/auth-jwt.service';
import { User } from '../core/auth/user.model';
import { AuthService } from '../core/auth/auth.service';
import { Login } from './login.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private authService = inject(AuthService);
  private authJwtService = inject(AuthJwtService);
  private router = inject(Router);

  /**
   * Effettua il login dell'utente e carica la sua identità
   * @param credentials Credenziali di login (email e password)
   * @returns Observable con i dati dell'account
   */
  login(credentials: Login): Observable<User | null> {
    return this.authJwtService.login(credentials).pipe(
      mergeMap(() => this.authService.identity(true)),
      tap((user) => {
        if (user) {
          this.authService.authenticate(user);
        }
      }),
      finalize(() => {
        if (this.authService.isAuthenticated()) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
  
  /**
   * Effettua il logout dell'utente
   */
  logout(): void {
    this.authJwtService.logout().subscribe({
      complete: () => {
        this.authService.authenticate(null);
        this.router.navigate(['/']);
      }
    });
  }
}
