import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { AxiosService } from "./axios.service";


export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface UserRegistration {
  nome: string;
  cognome: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl = "/auth";

  constructor(private axiosService: AxiosService) {}

  login(credentials: Credentials): Observable<AuthResponse> {
    return from(this.axiosService.post<AuthResponse>(`${this.baseUrl}/login`, credentials));
  }

  register(userData: UserRegistration): Observable<any> {
    return from(this.axiosService.post(`${this.baseUrl}/register`, userData));
  }

  forgotPassword(email: string): Observable<any> {
    return from(this.axiosService.post(`${this.baseUrl}/forgot-password`, { email }));
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    return from(this.axiosService.post(`${this.baseUrl}/reset-password`, resetData));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
} 