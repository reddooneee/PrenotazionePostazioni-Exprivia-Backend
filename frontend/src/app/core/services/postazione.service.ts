import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosService } from './axios.service';
import { Postazione } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostazioneService {
  private readonly BASE_URL = '/api/postazioni';

  constructor(private axiosService: AxiosService) {}

  getPostazioni(): Observable<Postazione[]> {
    return from(this.axiosService.get<Postazione[]>(`${this.BASE_URL}`));
  }

  getPostazioneById(id: number): Observable<Postazione> {
    return from(this.axiosService.get<Postazione>(`${this.BASE_URL}/${id}`));
  }

  getPostazioniByStanza(stanzaId: number): Observable<Postazione[]> {
    return from(this.axiosService.get<Postazione[]>(`${this.BASE_URL}/stanza/${stanzaId}`));
  }

  getPostazioniByPiano(piano: number): Observable<Postazione[]> {
    return from(this.axiosService.get<Postazione[]>(`${this.BASE_URL}/piano/${piano}`));
  }

  createPostazione(postazione: Postazione): Observable<Postazione> {
    return from(this.axiosService.post<Postazione>(`${this.BASE_URL}/creaPostazione`, postazione));
  }

  updatePostazione(id: number, updates: Partial<Postazione>): Observable<Postazione> {
    return from(this.axiosService.put<Postazione>(`${this.BASE_URL}/aggiornaPostazione/${id}`, updates));
  }

  deletePostazione(id: number): Observable<void> {
    return from(this.axiosService.delete(`${this.BASE_URL}/eliminaPostazione/${id}`)).pipe(
      map(() => void 0)
    );
  }

  getPostazioniDisponibili(data: Date): Observable<Postazione[]> {
    const formattedDate = data.toISOString().split('T')[0];
    return from(this.axiosService.get<Postazione[]>(`${this.BASE_URL}/disponibili/${formattedDate}`));
  }
}
