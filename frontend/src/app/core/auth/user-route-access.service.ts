import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export class UserRouteAccessService {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const authorities = route.data['authorities'] as string[];

    // Se non ci sono autorità richieste, permetti l'accesso
    if (!authorities || authorities.length === 0) {
      return true;
    }

    // Verifica se l'utente è autenticato e ha i permessi necessari
    if (this.authService.isAuthenticated()) {
      if (this.authService.hasAnyAuthority(authorities)) {
        return true;
      } else {
        // L'utente è autenticato ma non ha i permessi richiesti
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    // Utente non autenticato, reindirizza alla home
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}