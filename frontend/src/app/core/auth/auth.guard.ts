import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const AuthGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Store the attempted URL for redirecting
    return router.createUrlTree(['/accedi'], { 
      queryParams: { returnUrl: state.url }
    });
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
        return true;
      }

      if (authService.hasAnyAuthority(authorities)) {
        return true;
      }

      return router.createUrlTree(['/forbidden']);
    })
  );
};