import { inject, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // First check if user is authenticated via JWT
    if (!this.authService.isAuthenticated()) {
      console.log('AuthGuard: User not authenticated, redirecting to login');
      return this.router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
    }

    // Then check user identity
    return this.authService.getIdentity().pipe(
      take(1),
      map(user => {
        if (!user) {
          console.log('AuthGuard: No user found, redirecting to login');
          return this.router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
        }

        const authorities = route.data['authorities'] as string[];
        
        // If no authorities required, allow access
        if (!authorities || authorities.length === 0) {
          console.log('AuthGuard: No authorities required, access granted');
          return true;
        }

        // Check if user has required authorities
        if (this.authService.hasAnyAuthority(authorities)) {
          console.log('AuthGuard: User has required authorities, access granted');
          return true;
        }

        // If user doesn't have required authorities, redirect to forbidden
        console.log('AuthGuard: User lacks required authorities, redirecting to forbidden');
        return this.router.createUrlTree(['/forbidden']);
      })
    );
  }
}