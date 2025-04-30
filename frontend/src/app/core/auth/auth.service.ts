import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { AxiosService } from '../../service/axios.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerEndpoint = '/auth/register';  // Endpoint di registrazione
  private loginEndpoint = '/auth/login';        // Endpoint di login
  private forgotpwdEndpoint = '/auth/forgot-password' //Endpoint Per recupero pwd
  private resetpwdEndpoint = '/auth/reset-password' //Endpoint conferma pwd

  constructor(private axiosService: AxiosService) {}

  registerUser(user: User): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.registerEndpoint, user)
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // Login utente
  loginUser(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return new Observable((observer) => {
      this.axiosService.post(this.loginEndpoint, credentials)
        .then((response) => {
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
            observer.next(response);
            observer.complete();
          } else {
            observer.error('Login fallito');
          }
        })
        .catch((error) => {
          observer.error('Credenziali errate');
        });
    });
  }

  // Logout utente
  logoutUser(): void {
    localStorage.removeItem('jwt_token');
  }

//Recupero pwd utente
  forgotPassword(email: string): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.forgotpwdEndpoint, { email })
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

resetPassword(token: string, newPassword: string): Observable<any> {
  return new Observable((observer) => {
    this.axiosService.post(this.resetpwdEndpoint, {
      token,
      newPassword
    })
    .then((response) => {
      observer.next(response);
      observer.complete();
    })
    .catch((error) => {
      observer.error(error);
    });
  });
}
  // Ottieni il token JWT
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;  // ritorna true se il token è presente, altrimenti false
  }



}
