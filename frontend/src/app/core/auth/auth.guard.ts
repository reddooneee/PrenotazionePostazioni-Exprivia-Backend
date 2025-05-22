import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take, switchMap, of } from 'rxjs';
import { AuthService } from './auth.service';

export const AuthGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAuthenticationState().pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(router.createUrlTree(['/accedi'], { 
          queryParams: { returnUrl: state.url }
        }));
      }

      return authService.getIdentity().pipe(
        take(1),
        map(user => {
          if (!user) {
            return router.createUrlTree(['/accedi'], { 
              queryParams: { returnUrl: state.url }
            });
          }

          const authorities = route.data['authorities'] as string[];
          
          if (!authorities || authorities.length === 0) {
            // If we're authenticated and there are no authority requirements,
            // redirect to the default authenticated route
            if (state.url === '/accedi' || state.url === '/') {
              return router.createUrlTree(['/dashboard/prenotazione-posizione']);
            }
            return true;
          }

          if (authService.hasAnyAuthority(authorities)) {
            return true;
          }

          // If user is authenticated but doesn't have required authorities,
          // redirect to forbidden page
          return router.createUrlTree(['/forbidden']);
        })
      );
    })
  );
};