import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosService } from './axios.service';
import { Prenotazione, PrenotazioneRequest } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class PrenotazioneService {
    private readonly BASE_URL = '/api/prenotazioni';

    constructor(private axiosService: AxiosService) {}

    /**
     * Recupera tutte le prenotazioni
     */
    getPrenotazioni(): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.BASE_URL}/lista`));
    }

    /**
     * Recupera le prenotazioni di una data specifica
     */
    getPrenotazioneById(id: number): Observable<Prenotazione> {
        return from(this.axiosService.get<Prenotazione>(`${this.BASE_URL}/${id}`));
    }

    /**
     * Recupera le prenotazioni di una data specifica
     */
    getPrenotazioniByDay(date: string): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.BASE_URL}/prenotazioni-del-giorno?data=${date}`));
    }


    /**
     * Crea una nuova prenotazione
     */
    createPrenotazione(prenotazione: Prenotazione): Observable<Prenotazione> { 
        return from(this.axiosService.post<Prenotazione>(`${this.BASE_URL}/creaPrenotazione`, prenotazione));
    }

    /**
     * Aggiorna una prenotazione esistente
     */
    updatePrenotazione(id: number, updates: Partial<Prenotazione>): Observable<Prenotazione> {
        return from(this.axiosService.put<Prenotazione>(`${this.BASE_URL}/aggiornaPrenotazione/${id}`, updates));
    }

    /**
     * Elimina una prenotazione
     */
    deletePrenotazione(id: number): Observable<void> {
        return from(this.axiosService.delete(`${this.BASE_URL}/eliminaPrenotazione/${id}`)).pipe(
            map(() => void 0)
        );
    }

    /**
     * Esporta le prenotazioni giornaliere in formato Excel
     */
    exportPrenotazioniDaily(date: Date): Observable<Blob> {
        console.log(" Inizio Chiamatam API");
        const giorno = String(date.getDate()).padStart(2, '0');
        const mese = String(date.getMonth()).padStart(2, '0'); // mese da 0 a 11
        const anno = date.getFullYear();

        const formattedDate = `${anno}-${mese}-${giorno}`;
        console.log("Data corretta da inviare:", formattedDate);
    
        return from(this.axiosService.get<Blob>(
            `${this.BASE_URL}/export/giorno/${formattedDate}`,
            { responseType: 'blob' }
            
        ));
        
    }
   
}
