import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export const UserRouteAccessService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authorities = route.data['authorities'] as string[];

  // Se non ci sono autorità richieste, permetti l'accesso
  if (!authorities || authorities.length === 0) {
    return true;
  }

  // Verifica se l'utente è autenticato e ha i permessi necessari
  if (authService.isAuthenticated()) {
    if (authService.hasAnyAuthority(authorities)) {
      return true;
    } else {
      // L'utente è autenticato ma non ha i permessi richiesti
      return router.createUrlTree(['/forbidden']);
    }
  }

  // Utente non autenticato, reindirizza alla home
  return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
};