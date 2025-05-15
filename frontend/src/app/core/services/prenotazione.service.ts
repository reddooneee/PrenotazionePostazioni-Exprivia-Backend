import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosService } from './axios.service';
import { Prenotazione } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class PrenotazioneService {
    private baseUrl = '/api/prenotazioni';

    constructor(private axiosService: AxiosService) {}

    getAllPrenotazioni(): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.baseUrl}/lista`));
    }

    // Alias for backward compatibility
    getPrenotazioni(): Observable<Prenotazione[]> {
        return this.getAllPrenotazioni();
    }

    getPrenotazioneById(id: number): Observable<Prenotazione> {
        return from(this.axiosService.get<Prenotazione>(`${this.baseUrl}/${id}`));
    }

    getPrenotazioniByUser(userId: number): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.baseUrl}/utente/${userId}`));
    }

    getPrenotazioniByData(date: Date): Observable<Prenotazione[]> {
        const formattedDate = date.toISOString().split('T')[0];
        return from(this.axiosService.get<Prenotazione[]>(`${this.baseUrl}/data/${formattedDate}`));
    }

    createPrenotazione(prenotazione: Partial<Prenotazione>): Observable<Prenotazione> {
        return from(this.axiosService.post<Prenotazione>(`${this.baseUrl}/creaPrenotazione`, prenotazione));
    }

    updatePrenotazione(id: number, updates: Partial<Prenotazione>): Observable<Prenotazione> {
        return from(this.axiosService.put<Prenotazione>(`${this.baseUrl}/aggiornaPrenotazione/${id}`, updates));
    }

    deletePrenotazione(id: number): Observable<void> {
        return from(this.axiosService.delete(`${this.baseUrl}/eliminaPrenotazione/${id}`)).pipe(
            map(() => void 0)
        );
    }

    checkAvailability(date: string, workspaceId: number): Observable<boolean> {
        return from(this.axiosService.get<boolean>(`${this.baseUrl}/disponibilita/${workspaceId}/${date}`));
    }
}
