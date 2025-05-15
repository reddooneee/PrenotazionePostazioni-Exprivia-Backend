import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AxiosService } from '../../../service/axios.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private readonly resetPwdEndpoint = '/auth/reset-password';
  private axiosService = inject(AxiosService);

  /**
   * Reset della password
   * @param token Il token di reset
   * @param newPassword La nuova password
   * @returns Observable con la risposta del server
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.resetPwdEndpoint, {
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
}
