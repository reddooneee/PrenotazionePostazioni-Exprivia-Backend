import { inject, Injectable } from "@angular/core";
import { AuthJwtService } from "./auth-jwt.service";
import { AxiosService } from "../../core/services/axios.service";
import { BehaviorSubject, Observable, tap, catchError, of, from, throwError, switchMap } from "rxjs";
import { User } from "../models";
import { TokenService } from "./token.service";
import { Router } from "@angular/router";

interface AuthResponse {
  token: string;
}

interface UserRegistration {
  nome: string;
  cognome: string;
  email: string;
  password: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userIdentity = new BehaviorSubject<User | null>(null);
  private authenticationState = new BehaviorSubject<boolean>(false);
  private accountCacheKey = "account-cache";
  private userIdentity$ = this.userIdentity.asObservable();
  private authenticationState$ = this.authenticationState.asObservable();
  private currentUser: User | null = null;
  private initialized = false;
  private readonly baseUrl = "/api/auth";

  private authJwtService = inject(AuthJwtService);
  private axiosService = inject(AxiosService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private accountUrl = "/api/utenti/current";

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (this.initialized) return;
    
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isTokenValid()) {
      try {
        const cachedUser = this.getCachedAccount();
        if (cachedUser) {
          this.authenticate(cachedUser);
        }
        
        const user = await this.fetchUserIdentity();
        if (user) {
          this.authenticate(user);
        } else {
          if (!cachedUser) {
            this.authenticate(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (!this.getCachedAccount()) {
          this.authenticate(null);
        }
      }
    } else {
      this.authenticate(null);
    }
    this.initialized = true;
  }

  private async fetchUserIdentity(): Promise<User | null> {
    try {
      const response = await this.axiosService.get<User>(this.accountUrl);
      const user = response as User;
      if (this.isValidUser(user)) {
        this.cacheAccount(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user identity:', error);
      return null;
    }
  }

  identity(force = false): Observable<User | null> {
    if (!force && this.currentUser) {
      return of(this.currentUser);
    }

    if (!this.authJwtService.isAuthenticated()) {
      this.authenticate(null);
      return of(null);
    }

    return from(this.fetchUserIdentity()).pipe(
      tap(user => {
        if (user) {
          this.authenticate(user);
        } else {
          this.authenticate(null);
        }
      }),
      catchError(error => {
        console.error('Error in identity observable:', error);
        this.authenticate(null);
        return of(null);
      })
    );
  }

  private isValidUser(user: any): user is User {
    return (
      user &&
      typeof user.nome === "string" &&
      typeof user.cognome === "string" &&
      typeof user.email === "string" &&
      Array.isArray(user.authorities)
    );
  }

  authenticate(identity: User | null): void {
    this.userIdentity.next(identity);
    this.authenticationState.next(identity !== null);
    this.currentUser = identity;

    if (!identity) {
      this.clearAccountCache();
      this.tokenService.clearToken();
    } else {
      this.cacheAccount(identity);
    }
  }

  hasAnyAuthority(authorities: string[]): boolean {
    const account = this.userIdentity.value;
    if (!account || !account.authorities) {
      return false;
    }
    return authorities.some((authority) =>
      account.authorities?.includes(authority)
    );
  }

  isAuthenticated(): boolean {
    return this.authJwtService.isAuthenticated() && this.currentUser !== null;
  }

  getAuthenticationState(): Observable<boolean> {
    return this.authenticationState$;
  }

  getIdentity(): Observable<User | null> {
    return this.userIdentity$;
  }

  private cacheAccount(account: User): void {
    if (account) {
      try {
        localStorage.setItem(this.accountCacheKey, JSON.stringify(account));
      } catch (error) {
        console.error("Error caching account:", error);
      }
    }
  }

  private getCachedAccount(): User | null {
    try {
      const cachedAccount = localStorage.getItem(this.accountCacheKey);
      if (!cachedAccount) return null;

      const account = JSON.parse(cachedAccount) as User;
      return this.isValidUser(account) ? account : null;
    } catch (error) {
      console.error("Error reading cached account:", error);
      return null;
    }
  }

  private clearAccountCache(): void {
    try {
      localStorage.removeItem(this.accountCacheKey);
    } catch (error) {
      console.error("Error clearing account cache:", error);
    }
  }

  async getUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    return this.fetchUserIdentity();
  }

  logout(): Observable<void> {
    return this.authJwtService.logout().pipe(
      tap(() => {
        this.authenticate(null);
        this.clearAccountCache();
        this.router.navigate(['/']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.authenticate(null);
        this.clearAccountCache();
        this.router.navigate(['/']);
        return throwError(() => error);
      })
    );
  }

  register(userData: UserRegistration): Observable<any> {
    return from(this.axiosService.post(`${this.baseUrl}/register`, userData)).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return from(this.axiosService.post(`${this.baseUrl}/forgot-password`, { email })).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    return from(this.axiosService.post(`${this.baseUrl}/reset-password`, resetData)).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }
}
