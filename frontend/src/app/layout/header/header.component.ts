import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/user.model';
import { filter, Subscription } from 'rxjs';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  activeRoute: string = '';

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    // Set initial route
    this.activeRoute = this.router.url;
    console.log('Initial route:', this.activeRoute);

    // Check initial auth state
    this.updateAuthState();

    // Subscribe to auth state changes
    this.authSubscription = this.authService.getAuthenticationState().subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.authService.getIdentity().subscribe(user => {
            this.currentUser = user;
          });
        } else {
          this.currentUser = null;
        }
      }
    );

    // Subscribe to route changes
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.urlAfterRedirects;
      console.log('Route changed to:', this.activeRoute);
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private updateAuthState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.authService.getIdentity().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  logout() {
    this.loginService.logout();
  }

  isRouteActive(route: string): boolean {
    // Remove trailing slashes for consistent comparison
    const currentRoute = this.activeRoute.replace(/\/$/, '');
    const checkRoute = route.replace(/\/$/, '');

    // Handle home route
    if (checkRoute === '') {
      return currentRoute === '' || currentRoute === '/';
    }

    // Handle dashboard routes
    if (checkRoute === '/dashboard') {
      return currentRoute === '/dashboard' || 
             currentRoute.startsWith('/dashboard/');
    }

    // Handle specific routes
    if (checkRoute === '/accedi') {
      return currentRoute === '/accedi';
    }

    if (checkRoute === '/registrazione') {
      return currentRoute === '/registrazione';
    }

    // Handle user management route
    if (checkRoute === '/dashboard/user-management') {
      return currentRoute === '/dashboard/user-management';
    }

    // Default case: exact match or starts with
    return currentRoute === checkRoute || 
           (checkRoute !== '/' && currentRoute.startsWith(checkRoute));
  }
}
