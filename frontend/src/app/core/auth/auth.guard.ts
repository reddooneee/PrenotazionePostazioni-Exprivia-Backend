import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roleRequired = route.data['role']; // Ruolo richiesto dalla rotta
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getRoles();
      if (roleRequired && roleRequired !== userRole) {
        this.router.navigate(['/dashboard']);  // Reindirizza alla dashboard generica se il ruolo non corrisponde
        return false;
      }
      return true;
    }
    this.router.navigate(['/']);  
    return false;
  }
}
