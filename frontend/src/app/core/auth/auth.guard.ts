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
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/accedi']);
    }

    return this.authService.getIdentity().pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/accedi']);
        }

        const authorities = route.data['authorities'] as string[];
        
        if (!authorities || authorities.length === 0) {
          return true;
        }

        if (this.authService.hasAnyAuthority(authorities)) {
          return true;
        }

        return this.router.createUrlTree(['/forbidden']);
      })
    );
  }
}