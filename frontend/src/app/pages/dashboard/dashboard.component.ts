import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/auth/user.model';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LoginService } from '../../login/login.service';
import { LucideAngularModule } from 'lucide-angular';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../service/user.service';
import { DeskService } from '../../service/desk.service';
import { BookingService } from '../../service/booking.service';
import { AxiosService } from '../../service/axios.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SidebarComponent],
  providers: [
    AuthService,
    LoginService,
    UserService,
    DeskService,
    BookingService,
    AxiosService
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isUser = false;

  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;
  activeRoute: string = '';

  // Date and time
  currentDate = new Date();
  currentTime = new Date().toLocaleTimeString();
  private timeSubscription?: Subscription;

  // Dashboard data
  notificationCount = 0;
  todayBookings = 0;
  availableDesks = 0;
  totalDesks = 0;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private deskService: DeskService,
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    // Set initial route
    this.activeRoute = this.router.url;

    // Check initial auth state
    this.updateAuthState();

    // Subscribe to auth state changes
    this.authSubscription = this.authService.getAuthenticationState().subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.authService.getIdentity().subscribe(user => {
            this.currentUser = user;
            this.isAdmin = user?.authorities?.includes('ROLE_ADMIN') ?? false;
          });
        } else {
          this.currentUser = null;
        }
      }
    );

    // Update time every second
    this.timeSubscription = interval(1000)
      .pipe(
        map(() => new Date().toLocaleTimeString())
      )
      .subscribe(time => {
        this.currentTime = time;
      });

    // Load dashboard data
    this.loadDashboardData();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
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

  // Check if we're on the dashboard home route
  isHomeRoute(): boolean {
    return this.router.url === '/dashboard' || this.router.url === '/dashboard/';
  }

  private async loadDashboardData(): Promise<void> {
    try {
      // Load desk statistics
      const desks = await this.deskService.getDesks();
      this.totalDesks = desks.length;
      this.availableDesks = desks.filter(desk => desk.isAvailable).length;

      // Load today's bookings
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  getAvailableDesksPercentage(): string {
    if (this.totalDesks === 0) return '0%';
    return `${(this.availableDesks / this.totalDesks * 100)}%`;
  }
}

