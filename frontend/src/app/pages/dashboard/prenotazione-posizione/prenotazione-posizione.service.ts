import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PrenotazioneService } from '@core/services/prenotazione.service';
import { StanzaService } from '@core/services/stanza.service';
import { StanzaWithPostazioni } from '@core/models/stanza.model';
import { PostazioneWithStanza } from '@core/models/postazione.model';
import { PrenotazioneRequest, Prenotazione } from '@core/models/prenotazione.model';
import { TimeSlot } from './prenotazione-posizione.model';

@Injectable()
export class PrenotazionePosizioneService {
    private readonly ORARI_LAVORATIVI = {
        INIZIO: 8,
        FINE: 18
    };


    constructor(
        private prenotazioneService: PrenotazioneService,
        private stanzaService: StanzaService
    ) {}

    getStanzeWithPostazioni(): Observable<StanzaWithPostazioni[]> {
        return this.stanzaService.getStanzeWithPostazioni().pipe(
            map(stanze => stanze.map(stanza => ({
                ...stanza,
                postazioni: stanza.postazioni || []
            })))
        );
    }

    getUserPrenotazioni(): Observable<Prenotazione[]> {
        return this.prenotazioneService.getPrenotazioni();
    }

    getPostazioniByStanza(stanzaId: number, stanze: StanzaWithPostazioni[]): PostazioneWithStanza[] {
        const stanza = stanze.find(s => s.id_stanza === stanzaId);
        if (!stanza) return [];

        return stanza.postazioni
            .filter(p => p.id_postazione && p.nomePostazione)
            .map(p => ({
                id_postazione: p.id_postazione!,
                nomePostazione: p.nomePostazione!,
                stanza_id: stanzaId,
                stanza_nome: stanza.nome,
                tipo_stanza: stanza.tipo_stanza
            }));
    }

    getAvailableTimeSlots(date: Date, postazioneId: number): Observable<TimeSlot[]> {
        return this.prenotazioneService.getPrenotazioniByDay(date.toISOString().split('T')[0]).pipe(
            map((prenotazioni: Prenotazione[]) => {
                const occupiedSlots = prenotazioni
                    .filter((p: Prenotazione) => p.postazione?.id_postazione === postazioneId)
                    .map((p: Prenotazione) => ({
                        start: new Date(p.data_inizio!).getHours(),
                        end: new Date(p.data_fine!).getHours()
                    }));

                return this.generateTimeSlots(occupiedSlots);
            })
        );
    }


    getFileByPrenotazioni(date:Date): Observable<Blob> {
        return this.prenotazioneService.exportPrenotazioniDaily(date);
    }



    createPrenotazione(request: PrenotazioneRequest): Observable<void> {
        return this.prenotazioneService.createPrenotazione(request).pipe(
            map(() => void 0)
        );
    }

    private generateTimeSlots(occupiedSlots: { start: number; end: number }[]): TimeSlot[] {
        const slots: TimeSlot[] = [];
        
        for (let hour = this.ORARI_LAVORATIVI.INIZIO; hour < this.ORARI_LAVORATIVI.FINE; hour++) {
            const isOccupied = occupiedSlots.some(slot => 
                hour >= slot.start && hour < slot.end
            );

            if (!isOccupied) {
                slots.push({
                    start: `${hour.toString().padStart(2, '0')}:00`,
                    end: `${(hour + 1).toString().padStart(2, '0')}:00`
                });
            }
        }

        return slots;
    }

    isValidTimeSlot(time: string): boolean {
        const hour = parseInt(time.split(':')[0]);
        return hour >= this.ORARI_LAVORATIVI.INIZIO && hour < this.ORARI_LAVORATIVI.FINE;
    }

    isWorkingDay(date: Date): boolean {
        const day = date.getDay();
        return day !== 0 && day !== 6; // 0 = Domenica, 6 = Sabato
    }


    
} 