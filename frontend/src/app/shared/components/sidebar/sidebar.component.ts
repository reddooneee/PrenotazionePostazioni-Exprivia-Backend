import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { LucideAngularModule } from 'lucide-angular';
import { MatIconModule } from '@angular/material/icon';

import { User } from '../../../core/auth/user.model';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginService } from '../../../login/login.service';
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatExpansionModule,
    MatIconModule,
    LucideAngularModule
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'home',
      route: '/dashboard'
    },
    {
      label: 'Gestione',
      icon: 'folder',
      route: '/dashboard/management',
      children: [
        {
          label: 'Utenti',
          icon: 'users',
          route: '/dashboard/user-management',
          adminOnly: true
        },
        {
          label: 'Prenotazioni',
          icon: 'calendar',
          route: '/dashboard/bookings'
        }
      ]
    }
  ];

  constructor(
    private authService: AuthService,
    private loginService: LoginService
  ) {}


// Aggiungi questo metodo per mappare i ruoli
getRoleDisplayName(authorities: string[] | undefined): string {
    if (!authorities || authorities.length === 0) {
      return 'Ruolo sconosciuto';
    }
  
    // Check the first role, or use the first matching role
    const primaryRole = authorities.find(role => 
      role === 'ROLE_ADMIN' || role === 'ROLE_USER'
    );
  
    switch (primaryRole) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_USER':
        return 'Dipendente';
      default:
        return 'Ruolo sconosciuto';
    }
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthenticationState().subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.authService.getIdentity().subscribe({
            next: (user) => {
              this.currentUser = user;
              // Assuming roles are part of the user object
              this.isAdmin = user?.authorities?.includes('ROLE_ADMIN') || false;
            },
            error: (error) => {
              console.error('Error fetching user identity', error);
              this.resetAuthState();
            }
          });
        } else {
          this.resetAuthState();
        }
      },
      error: (error) => {
        console.error('Authentication state error', error);
        this.resetAuthState();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private resetAuthState(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.isAdmin = false;
  }

  logout(): void {
    this.loginService.logout();
  }

  isRouteActive(route: string): boolean {
    const currentRoute = window.location.pathname.replace(/\/$/, '');
    const checkRoute = route.replace(/\/$/, '');

    const routeMap: { [key: string]: (route: string) => boolean } = {
      '': () => currentRoute === '' || currentRoute === '/',
      '/dashboard': () => currentRoute.startsWith('/dashboard'),
      '/dashboard/user-management': () => currentRoute === '/dashboard/user-management',
      '/dashboard/bookings': () => currentRoute === '/dashboard/bookings',
      '/dashboard/management': () => currentRoute.startsWith('/dashboard/management')
    };

    return routeMap[checkRoute] 
      ? routeMap[checkRoute](currentRoute)
      : currentRoute === checkRoute || currentRoute.startsWith(checkRoute);
  }

  isNavItemVisible(item: NavItem): boolean {
    return !item.adminOnly || this.isAdmin;
  }
}