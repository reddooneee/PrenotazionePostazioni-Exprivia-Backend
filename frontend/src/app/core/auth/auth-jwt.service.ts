import { inject, Injectable } from "@angular/core";
import { AxiosService } from "../../core/services/axios.service";
import { Login } from "../../login/login.model";
import { Observable, from, catchError, tap, throwError } from "rxjs";
import { TokenService } from "./token.service";

interface AuthResponse {
  token: string;
  email: string;
  authorities: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthJwtService {
  private axiosService = inject(AxiosService);
  private tokenService = inject(TokenService);
  private loginUrl = '/auth/login';

  constructor() { }

  login(credentials: Login): Observable<AuthResponse> {
    return from(this.axiosService.post<AuthResponse>(this.loginUrl, credentials)).pipe(
      tap((response) => {
        if (response?.token) {
          this.tokenService.storeToken(response.token);
        } else {
          throw new Error('Invalid response: missing token');
        }
      }),
      catchError((error) => {
        console.error('Login error in AuthJwtService:', {
          timestamp: new Date().toISOString(),
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return new Observable<void>(observer => {
      try {
        this.tokenService.clearToken();
        observer.next();
        observer.complete();
      } catch (error) {
        console.error('Logout error:', {
          timestamp: new Date().toISOString(),
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        observer.error(error);
      }
    });
  }

  isAuthenticated(): boolean {
    return this.tokenService.isTokenValid();
  }

  getUserRoles(): string[] {
    return this.tokenService.getRoles();
  }

  hasAnyAuthority(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }
}