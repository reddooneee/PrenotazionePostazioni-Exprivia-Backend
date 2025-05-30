import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { LucideAngularModule } from "lucide-angular";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { LoginService } from "../../login/login.service";
import { User as UserModel } from "../../core/models";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LucideAngularModule
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: UserModel | null = null;
  isMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.authService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.loadUserIdentity();
        } else {
          this.resetAuthState();
        }
      });

    this.authService
      .getIdentity()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        if (!user) {
          this.resetAuthState();
        }
      });
  }

  private loadUserIdentity(): void {
    this.authService
      .getIdentity()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  private resetAuthState(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.isMenuOpen = false;
    this.loginService.logout();
  }

  isRouteActive(route: string): boolean {
    const currentRoute = window.location.pathname;
    if (route === '/dashboard/update-user') {
      return currentRoute === '/dashboard/update-user';
    }
    return currentRoute === route;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
