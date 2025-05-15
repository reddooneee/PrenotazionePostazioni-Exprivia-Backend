import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosService } from './axios.service';
import { Postazione } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostazioneService {
  private baseUrl = '/api/postazioni';

  constructor(private axiosService: AxiosService) {}

  getAllPostazioni(): Observable<Postazione[]> {
    return from(this.axiosService.get<Postazione[]>(this.baseUrl));
  }

  // Alias for backward compatibility
  getPostazioni(): Observable<Postazione[]> {
    return this.getAllPostazioni();
  }

  getPostazioneById(id: number): Observable<Postazione> {
    return from(this.axiosService.get<Postazione>(`${this.baseUrl}/${id}`));
  }

  createPostazione(postazione: Partial<Postazione>): Observable<Postazione> {
    return from(this.axiosService.post<Postazione>(`${this.baseUrl}/creaPostazione`, postazione));
  }

  updatePostazione(id: number, updates: Partial<Postazione>): Observable<Postazione> {
    return from(this.axiosService.put<Postazione>(`${this.baseUrl}/aggiornaPostazione/${id}`, updates));
  }

  deletePostazione(id: number): Observable<void> {
    return from(this.axiosService.delete(`${this.baseUrl}/eliminaPostazione/${id}`)).pipe(
      map(() => void 0)
    );
  }

  getAvailablePostazioni(date: string): Observable<Postazione[]> {
    return from(this.axiosService.get<Postazione[]>(`${this.baseUrl}/disponibili/${date}`));
  }

  getPostazioniByStanza(stanzaId: number): Observable<Postazione[]> {
    return from(this.axiosService.get<Postazione[]>(`${this.baseUrl}/stanza/${stanzaId}`));
  }
}
