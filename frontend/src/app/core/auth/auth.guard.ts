import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {


    private authService = inject(AuthService);
    private router = inject(Router);

  canActivate(route: any): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRoles = this.authService.getRoles();

    if (!expectedRoles.some(role => userRoles.includes(role))) {
      this.router.navigate(['/unauthorized']); // o redirect dove preferisci
      return false;
    }

    return true;
  }
}
