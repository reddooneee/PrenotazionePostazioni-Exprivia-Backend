import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AxiosService } from './axios.service';
import { Prenotazione, PrenotazioneRequest } from '@core/models';
import { StanzaWithPostazioni } from '@core/models/stanza.model';

@Injectable({
    providedIn: 'root'
})
export class PrenotazioneService {
    private readonly BASE_URL = '/api/prenotazioni';

    constructor(private axiosService: AxiosService) { }

    /**
     * Recupera tutte le stanze con le relative postazioni
     */
    getStanzeEPostazioni(): Observable<{ stanze: StanzaWithPostazioni[] }> {
        return from(this.axiosService.get<{ stanze: StanzaWithPostazioni[] }>(`${this.BASE_URL}/stanze-e-postazioni`)).pipe(
            catchError(error => {
                console.error('Errore nel recupero delle stanze e postazioni:', error);
                return throwError(() => new Error('Impossibile recuperare le stanze e le postazioni'));
            })
        );
    }

    /**
     * Recupera tutte le prenotazioni
     */
    getPrenotazioni(): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.BASE_URL}/lista`)).pipe(
            catchError(error => {
                console.error('Errore nel recupero delle prenotazioni:', error);
                return throwError(() => new Error('Impossibile recuperare le prenotazioni'));
            })
        );
    }

    /**
     * Recupera le prenotazioni dell'utente corrente
     */
    getMiePrenotazioni(): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.BASE_URL}/mie-prenotazioni`)).pipe(
            catchError(error => {
                console.error('Errore nel recupero delle tue prenotazioni:', error);
                return throwError(() => new Error('Impossibile recuperare le tue prenotazioni'));
            })
        );
    }

    /**
     * Recupera una prenotazione specifica
     */
    getPrenotazioneById(id: number): Observable<Prenotazione> {
        return from(this.axiosService.get<Prenotazione>(`${this.BASE_URL}/${id}`)).pipe(
            catchError(error => {
                console.error(`Errore nel recupero della prenotazione ${id}:`, error);
                return throwError(() => new Error('Prenotazione non trovata'));
            })
        );
    }

    /**
     * Recupera le prenotazioni di una data specifica
     */
    getPrenotazioniByDay(date: string): Observable<Prenotazione[]> {
        return from(this.axiosService.get<Prenotazione[]>(`${this.BASE_URL}/prenotazioni-del-giorno?data=${date}`)).pipe(
            catchError(error => {
                console.error('Errore nel recupero delle prenotazioni del giorno:', error);
                return throwError(() => new Error('Impossibile recuperare le prenotazioni del giorno'));
            })
        );
    }

    /**
     * Recupera gli orari disponibili per una postazione in una data specifica
     */
    getAvailableTimeSlots(date: Date, postazioneId: number): Observable<string[]> {
        const formattedDate = date.toISOString().split('T')[0];
        return from(this.axiosService.get<string[]>(
            `${this.BASE_URL}/postazioni/${postazioneId}/orari-disponibili?data=${formattedDate}`
        )).pipe(
            catchError(error => {
                console.error('Errore nel recupero degli orari disponibili:', error);
                return throwError(() => new Error('Impossibile recuperare gli orari disponibili'));
            })
        );
    }

    /**
     * Crea una nuova prenotazione
     */
    createPrenotazione(prenotazione: PrenotazioneRequest): Observable<Prenotazione> {
        return from(this.axiosService.post<Prenotazione>(`${this.BASE_URL}/prenota`, prenotazione)).pipe(
            catchError(error => {
                console.error('Errore nella creazione della prenotazione:', error);
                const message = error.response?.data?.message || 'Impossibile creare la prenotazione';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * Crea una nuova prenotazione per un utente specifico (solo admin)
     */
    createPrenotazioneAdmin(prenotazione: PrenotazioneRequest & { id_user: number }): Observable<Prenotazione> {
        return from(this.axiosService.post<Prenotazione>(`${this.BASE_URL}/admin/prenota`, prenotazione)).pipe(
            catchError(error => {
                console.error('Errore nella creazione della prenotazione admin:', error);
                const message = error.response?.data?.message || 'Impossibile creare la prenotazione';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * Aggiorna una prenotazione esistente
     */
    updatePrenotazione(id: number, updates: Partial<Prenotazione>): Observable<Prenotazione> {
        return from(this.axiosService.put<Prenotazione>(`${this.BASE_URL}/aggiornaPrenotazione/${id}`, updates)).pipe(
            catchError(error => {
                console.error('Errore nell\'aggiornamento della prenotazione:', error);
                const message = error.response?.data?.message || 'Impossibile aggiornare la prenotazione';
                return throwError(() => new Error(message));
            })
        );
    }

    /**
     * Elimina una prenotazione
     */
    deletePrenotazione(id: number): Observable<void> {
        return from(this.axiosService.delete(`${this.BASE_URL}/eliminaPrenotazione/${id}`)).pipe(
            map(() => void 0),
            catchError(error => {
                console.error('Errore nell\'eliminazione della prenotazione:', error);
                return throwError(() => new Error('Impossibile eliminare la prenotazione'));
            })
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
