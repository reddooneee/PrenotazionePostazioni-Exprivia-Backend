import { inject, Injectable } from "@angular/core";
import { AxiosService } from "../../service/axios.service";
import { Login } from "../../login/login.model";
import { Observable } from "rxjs";
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
    return new Observable((observer) => {
      this.axiosService.post(this.loginUrl, credentials)
        .then((response: any) => {
          const authResponse = response as AuthResponse;
          if (authResponse?.token) {
            this.tokenService.storeToken(authResponse.token);
            observer.next(authResponse);
            observer.complete();
          }
        })
    });
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.tokenService.clearToken();
      observer.complete();
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