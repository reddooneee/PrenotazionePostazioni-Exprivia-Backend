import { inject, Injectable, isDevMode } from '@angular/core';
import { Observable, defer } from 'rxjs';
import { AxiosService } from '../../../service/axios.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private readonly forgotPwdEndpoint = '/auth/forgot-password';
  private axiosService = inject(AxiosService);

  /**
   * Invia una richiesta di recupero password
   * @param email L'email dell'utente
   * @returns Observable con la risposta del server
   */
  forgotPassword(email: string): Observable<any> {
    return defer(() =>
      this.axiosService.post(this.forgotPwdEndpoint, { email })
        .catch(error => {
          if (isDevMode()) {
            console.error('Errore durante il recupero password:', error);
          }
          throw error;
        })
    );
  }
}
