import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AxiosService } from '../../service/axios.service';


@Injectable({ providedIn: 'root' })
export class RegisterService {
  private axiosService = inject(AxiosService);  // Axios per le richieste HTTP
  private readonly registerEndpoint = '/auth/register';  // URL dell'endpoint di registrazione nel backend

  /**
   * Effettua la registrazione di un nuovo utente
   * @param userData I dati dell'utente per la registrazione
   * @returns Observable con la risposta del server
   */
  registerUser(userData: { email: string; password: string; nome: string; cognome: string; }): Observable<any> {
    return new Observable((observer) => {
      this.axiosService.post(this.registerEndpoint, userData)
        .then((response) => {
          observer.next(response);  // Restituisce la risposta del server
          observer.complete();  // Completamento della richiesta
        })
        .catch((error) => {
          console.error('Errore durante la registrazione:', error);
          observer.error('Errore durante la registrazione dell\'utente');
        });
    });
  }
}
