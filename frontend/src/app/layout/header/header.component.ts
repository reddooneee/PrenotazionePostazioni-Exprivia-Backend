import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { User as UserModel } from '../../core/auth/user.model';
import { LoginService } from '../../login/login.service';
import { LucideAngularModule, LogOut, User as UserIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterLink, CommonModule, LucideAngularModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: UserModel | null = null;
  isAuthenticated = false;
  protected readonly LogOut = LogOut;
  protected readonly User = UserIcon;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Initial check
    this.updateAuthState();
    
    // Subscribe to auth state changes
    this.authSubscription = this.authService.getAuthenticationState().subscribe(() => {
      this.updateAuthState();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateAuthState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.authService.getIdentity().subscribe(user => {
        this.currentUser = user;
      });
    } else {
      this.currentUser = null;
    }
  }

  logout() {
    this.loginService.logout();
  }
}
