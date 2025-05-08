import { inject, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
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
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const authorities = route.data['authorities'] as string[];
    
    // If no authorities required, allow access
    if (!authorities || authorities.length === 0) {
      return true;
    }

    // Check if user has required authorities
    if (this.authService.hasAnyAuthority(authorities)) {
      return true;
    }

    // If user is admin but trying to access user dashboard, redirect to admin dashboard
    if (this.authService.hasAnyAuthority(['ROLE_ADMIN']) && state.url === '/dashboard') {
      return this.router.createUrlTree(['/admin-dashboard']);
    }

    // If user is regular user but trying to access admin dashboard, redirect to user dashboard
    if (this.authService.hasAnyAuthority(['ROLE_USER']) && state.url === '/admin-dashboard') {
      return this.router.createUrlTree(['/dashboard']);
    }

    return this.router.createUrlTree(['/forbidden']);
  }
}