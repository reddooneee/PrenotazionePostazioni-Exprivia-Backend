import { inject, Injectable } from '@angular/core';
import { mergeMap, Observable, tap } from 'rxjs';
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
    console.log('LoginService: Starting login process...');
    return this.authJwtService.login(credentials).pipe(
      tap(response => {
        console.log('LoginService: JWT response received:', response);
      }),
      mergeMap(() => {
        console.log('LoginService: Getting user identity...');
        return this.authService.identity(true);
      }),
      tap((user) => {
        if (user) {
          console.log('LoginService: User authenticated, roles:', user.authorities);
          this.router.navigate(['/dashboard']).then(success => {
            console.log('LoginService: Navigation result:', success ? 'Success' : 'Failed');
          });
        } else {
          console.log('LoginService: No user identity found');
        }
      })
    );
  }
  
  /**
   * Effettua il logout dell'utente
   */
  logout(): void {
    console.log('LoginService: Starting logout process...');
    this.authJwtService.logout().subscribe({
      complete: () => {
        console.log('LoginService: JWT logout completed');
        this.authService.authenticate(null);
        console.log('LoginService: User identity cleared');
        this.router.navigate(['/']).then(success => {
          console.log('LoginService: Navigation result:', success ? 'Success' : 'Failed');
        });
      }
    });
  }
}
