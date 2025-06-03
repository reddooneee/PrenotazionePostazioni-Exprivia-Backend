import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, throwError } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { AxiosService } from '@core/services/axios.service';
import { PrenotazioneRequest, Prenotazione } from '@core/models/prenotazione.model';
import { StanzaWithPostazioni } from '@core/models/stanza.model';
import { StanzaService } from '@core/services/stanza.service';
import { PostazioneService } from '@core/services/postazione.service';
import { CosaDurataService } from '@core/services/cosa-durata.service';
import { PrenotazioneService } from '@core/services/prenotazione.service';

@Injectable({
  providedIn: 'root'
})
export class PrenotazionePosizioneService {

  constructor(
    private axiosService: AxiosService,
    private stanzaService: StanzaService,
    private postazioneService: PostazioneService,
    private cosaDurataService: CosaDurataService,
    private prenotazioneService: PrenotazioneService
  ) {}

  /**
   * Recupera tutte le stanze con le relative postazioni
   */
  getStanzeWithPostazioni(): Observable<{stanze: StanzaWithPostazioni[]}> {
    return this.stanzaService.getStanzeWithPostazioni().pipe(
      map(stanze => ({ stanze }))
    );
  }

  /**
   * Recupera le prenotazioni dell'utente corrente
   */
  getUserPrenotazioni(): Observable<Prenotazione[]> {
    return this.prenotazioneService.getMiePrenotazioni().pipe(
      catchError(error => {
        console.error('Errore nel recupero delle prenotazioni utente:', error);
        return throwError(() => new Error('Impossibile recuperare le tue prenotazioni'));
      })
    );
  }

  /**
   * Recupera gli orari disponibili per una postazione in una data specifica
   */
  getAvailableTimeSlots(date: Date, postazioneId: number): Observable<string[]> {
    return this.prenotazioneService.getAvailableTimeSlots(date, postazioneId).pipe(
      catchError(error => {
        console.error('Errore nel recupero degli orari disponibili:', error);
        return throwError(() => new Error('Impossibile recuperare gli orari disponibili'));
      })
    );
  }

  /**
   * Recupera tutte le informazioni necessarie per la prenotazione
   */
  getPrenotazioneInfo(): Observable<{
    stanze: StanzaWithPostazioni[],
    coseDurata: any[]
  }> {
    return forkJoin({
      stanze: this.stanzaService.getStanzeWithPostazioni(),
      coseDurata: this.cosaDurataService.getAllCoseDurata()
    }).pipe(
      catchError(error => {
        console.error('Errore nel recupero delle informazioni:', error);
        return throwError(() => new Error('Impossibile recuperare le informazioni necessarie'));
      })
    );
  }

  /**
   * Verifica la disponibilità di una postazione in una data specifica
   */
  checkPostazioneDisponibile(data: Date, postazioneId: number): Observable<boolean> {
    return this.postazioneService.getPostazioniDisponibili(data).pipe(
      map(postazioni => postazioni.some(p => p.id_postazione === postazioneId)),
      catchError(error => {
        console.error('Errore nella verifica disponibilità postazione:', error);
        return throwError(() => new Error('Impossibile verificare la disponibilità della postazione'));
      })
    );
  }

  /**
   * Crea una nuova prenotazione
   */
  createPrenotazione(request: PrenotazioneRequest): Observable<Prenotazione> {
    // Validazione dei dati prima dell'invio
    if (!request.id_postazione || !request.id_stanza || !request.data_inizio || !request.data_fine) {
      return throwError(() => new Error('Dati prenotazione incompleti'));
    }

    return this.prenotazioneService.createPrenotazione(request).pipe(
      catchError(error => {
        console.error('Errore nella creazione della prenotazione:', error);
        const message = error.response?.data?.message || 'Impossibile creare la prenotazione';
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Recupera le postazioni disponibili per una stanza in una data specifica
   */
  getPostazioniDisponibiliByStanza(stanzaId: number, data: Date): Observable<any[]> {
    return forkJoin({
      postazioniStanza: this.postazioneService.getPostazioniByStanza(stanzaId),
      postazioniDisponibili: this.postazioneService.getPostazioniDisponibili(data)
    }).pipe(
      map(({ postazioniStanza, postazioniDisponibili }) => {
        const disponibiliIds = new Set(postazioniDisponibili.map(p => p.id_postazione));
        return postazioniStanza.filter(p => disponibiliIds.has(p.id_postazione));
      }),
      catchError(error => {
        console.error('Errore nel recupero delle postazioni disponibili:', error);
        return throwError(() => new Error('Impossibile recuperare le postazioni disponibili'));
      })
    );
  }

  /**
   * Recupera tutte le prenotazioni
   */
  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.prenotazioneService.getPrenotazioni().pipe(
      catchError(error => {
        console.error('Errore nel recupero delle prenotazioni:', error);
        return throwError(() => new Error('Impossibile recuperare le prenotazioni'));
      })
    );
  }
} 