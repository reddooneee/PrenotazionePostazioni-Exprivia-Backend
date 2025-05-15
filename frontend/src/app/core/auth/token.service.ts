import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwt_token';
  private jwtHelper = new JwtHelperService();

  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      return [];
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Check both common JWT role claim formats
      const roles = decodedToken?.roles || decodedToken?.authorities || [];
      if (Array.isArray(roles)) {
        return roles;
      }
      if (typeof roles === 'string') {
        return roles.split(',').map(role => role.trim());
      }
      return [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return this.jwtHelper.getTokenExpirationDate(token) || null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }
} 