import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, throwError } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { AxiosService } from '@core/services/axios.service';
import { PrenotazioneRequest, Prenotazione, TimeSlot } from '@core/models/prenotazione.model';
import { StanzaWithPostazioni } from '@core/models/stanza.model';
import { StanzaService } from '@core/services/stanza.service';
import { PostazioneService } from '@core/services/postazione.service';
import { CosaDurataService } from '@core/services/cosa-durata.service';
import { PrenotazioneService } from '@core/services/prenotazione.service';
import { PostazioneWithStanza } from '@/app/core/models';
import { CosaDurata } from '@core/models/cosa-durata.model';

@Injectable({
  providedIn: 'root'
})
export class PrenotazionePosizioneService {
    private readonly ORARI_LAVORATIVI = {
        INIZIO: 8,
        FINE: 18
    };


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

    getUserPrenotazioni(): Observable<Prenotazione[]> {
        return this.prenotazioneService.getMiePrenotazioni();
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
        // Format date in local timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        console.log('DEBUG: Request parameters:', {
            formattedDate,
            postazioneId,
            originalDate: date,
            dateISOString: date.toISOString(),
            dateLocaleString: date.toLocaleString(),
            year,
            month,
            day
        });

        return this.prenotazioneService.getPrenotazioniByDayAndPostazione(formattedDate, postazioneId).pipe(
            map((prenotazioni: Prenotazione[]) => {
                console.log('Raw prenotazioni from backend:', JSON.stringify(prenotazioni, null, 2));
                
                if (!prenotazioni || prenotazioni.length === 0) {
                    console.log('No prenotazioni found, returning all available slots');
                    return this.generateTimeSlots([]);
                }

                // Filtra le prenotazioni escludendo quelle annullate
                const activePrenotazioni = prenotazioni.filter((p: Prenotazione) => 
                    p.stato_prenotazione !== 'Annullata'
                );
                
                console.log('Active prenotazioni (excluding cancelled):', {
                    total: prenotazioni.length,
                    active: activePrenotazioni.length,
                    cancelled: prenotazioni.length - activePrenotazioni.length
                });

                if (activePrenotazioni.length === 0) {
                    console.log('No active prenotazioni found, returning all available slots');
                    return this.generateTimeSlots([]);
                }

                const occupiedSlots = activePrenotazioni.map((p: Prenotazione) => {
                    console.log('Processing prenotazione:', {
                        id: p.id_prenotazioni,
                        raw_data_inizio: p.data_inizio,
                        raw_data_fine: p.data_fine
                    });

                    // Parse start date
                    let startDate;
                    if (typeof p.data_inizio === 'string') {
                        // Try different date formats
                        const dateStr = p.data_inizio.replace(' ', 'T');
                        startDate = new Date(dateStr);
                        
                        // If invalid, try parsing as array
                        if (isNaN(startDate.getTime())) {
                            const parts = dateStr.split(/[-T:]/);
                            if (parts.length >= 5) {
                                startDate = new Date(
                                    parseInt(parts[0]), // year
                                    parseInt(parts[1]) - 1, // month (0-based)
                                    parseInt(parts[2]), // day
                                    parseInt(parts[3]), // hours
                                    parseInt(parts[4]) // minutes
                                );
                            }
                        }
                    } else if (Array.isArray(p.data_inizio)) {
                        // Handle array format [year, month, day, hours, minutes]
                        startDate = new Date(
                            p.data_inizio[0],
                            p.data_inizio[1] - 1,
                            p.data_inizio[2],
                            p.data_inizio[3] || 0,
                            p.data_inizio[4] || 0
                        );
                    } else {
                        startDate = new Date(p.data_inizio);
                    }

                    // Parse end date
                    let endDate;
                    if (typeof p.data_fine === 'string') {
                        // Try different date formats
                        const dateStr = p.data_fine.replace(' ', 'T');
                        endDate = new Date(dateStr);
                        
                        // If invalid, try parsing as array
                        if (isNaN(endDate.getTime())) {
                            const parts = dateStr.split(/[-T:]/);
                            if (parts.length >= 5) {
                                endDate = new Date(
                                    parseInt(parts[0]), // year
                                    parseInt(parts[1]) - 1, // month (0-based)
                                    parseInt(parts[2]), // day
                                    parseInt(parts[3]), // hours
                                    parseInt(parts[4]) // minutes
                                );
                            }
                        }
                    } else if (Array.isArray(p.data_fine)) {
                        // Handle array format [year, month, day, hours, minutes]
                        endDate = new Date(
                            p.data_fine[0],
                            p.data_fine[1] - 1,
                            p.data_fine[2],
                            p.data_fine[3] || 0,
                            p.data_fine[4] || 0
                        );
                    } else {
                        endDate = new Date(p.data_fine);
                    }

                    console.log('Parsed dates:', {
                        startDate,
                        endDate,
                        startDateValid: !isNaN(startDate.getTime()),
                        endDateValid: !isNaN(endDate.getTime())
                    });

                    const startHour = startDate.getHours();
                    const endHour = endDate.getHours();

                    console.log('Extracted hours:', {
                        startHour,
                        endHour,
                        isValidStart: !isNaN(startHour),
                        isValidEnd: !isNaN(endHour)
                    });

                    // Validate hours before returning
                    if (isNaN(startHour) || isNaN(endHour)) {
                        console.warn('Invalid hours detected, skipping slot');
                        return null;
                    }

                    return {
                        start: startHour,
                        end: endHour
                    };
                }).filter(slot => slot !== null); // Remove any null slots

                console.log('Processed occupied slots:', occupiedSlots);
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

    createPrenotazioneAdmin(request: PrenotazioneRequest & { id_user: number }): Observable<void> {
        return this.prenotazioneService.createPrenotazioneAdmin(request).pipe(
            map(() => void 0)
        );
    }

    private generateTimeSlots(occupiedSlots: { start: number; end: number }[]): TimeSlot[] {
        const slots: TimeSlot[] = [];
        const startHour = this.ORARI_LAVORATIVI.INIZIO;
        const endHour = this.ORARI_LAVORATIVI.FINE;
        const slotDurations = [600, 240, 120, 60, 30]; // minutes: 600=10h (full day), 240=4h, 120=2h, 60=1h, 30=30min

        // Helper to check overlap
        function overlaps(startA: number, endA: number, startB: number, endB: number) {
            return startA < endB && endA > startB;
        }

        // Helper to convert hours to minutes for easier comparison
        function toMinutes(hour: number): number {
            return Math.floor(hour) * 60 + (hour % 1 === 0.5 ? 30 : 0);
        }

        // Helper to check if a slot is available
        function isSlotAvailable(slotStart: number, slotEnd: number): boolean {
            const slotStartMinutes = toMinutes(slotStart);
            const slotEndMinutes = toMinutes(slotEnd);
            
            return !occupiedSlots.some(occupied => {
                const occStart = toMinutes(occupied.start);
                const occEnd = toMinutes(occupied.end);
                return overlaps(slotStartMinutes, slotEndMinutes, occStart, occEnd);
            });
        }

        // Generate all possible slots
        for (const duration of slotDurations) {
            const step = duration >= 60 ? 60 : 30; // step by 1h or 30min
            for (let hour = startHour; hour < endHour; hour += step / 60) {
                const start = hour;
                const end = hour + duration / 60;
                if (end > endHour) continue;

                // Check if this slot is available
                if (isSlotAvailable(start, end)) {
                    const startTime = `${Math.floor(start).toString().padStart(2, '0')}:${(start % 1 === 0.5 ? '30' : '00')}`;
                    const endTime = `${Math.floor(end).toString().padStart(2, '0')}:${(end % 1 === 0.5 ? '30' : '00')}`;
                    
                    // Only add if not already present
                    if (!slots.some(s => s.startTime === startTime && s.endTime === endTime)) {
                        slots.push({ startTime, endTime });
                    }
                }
            }
        }

        // Special handling for full day slot
        const fullDayAvailable = isSlotAvailable(startHour, endHour);
        if (fullDayAvailable) {
            const fullDaySlot = { startTime: '08:00', endTime: '18:00' };
            if (!slots.some(s => s.startTime === fullDaySlot.startTime && s.endTime === fullDaySlot.endTime)) {
                slots.push(fullDaySlot);
            }
        }

        // Sort slots by duration (longest first) and then by start time
        slots.sort((a, b) => {
            const durA = toMinutes(parseInt(b.endTime.split(':')[0]) + parseInt(b.endTime.split(':')[1]) / 60) - 
                        toMinutes(parseInt(a.startTime.split(':')[0]) + parseInt(a.startTime.split(':')[1]) / 60);
            const durB = toMinutes(parseInt(b.endTime.split(':')[0]) + parseInt(b.endTime.split(':')[1]) / 60) - 
                        toMinutes(parseInt(b.startTime.split(':')[0]) + parseInt(b.startTime.split(':')[1]) / 60);
            if (durA !== durB) return durB - durA;
            return a.startTime.localeCompare(b.startTime);
        });

        console.log('Generated slots:', {
            total: slots.length,
            slots,
            occupiedSlots
        });

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

    getPrenotazioneInfo(): Observable<{stanze: StanzaWithPostazioni[], coseDurata: CosaDurata[]}> {
        return forkJoin({
            stanze: this.stanzaService.getStanzeWithPostazioni(),
            coseDurata: this.cosaDurataService.getAllCoseDurata()
        });
    }

    getPrenotazioni(): Observable<Prenotazione[]> {
        return this.prenotazioneService.getPrenotazioni();
    }

    getMiePrenotazioni(): Observable<Prenotazione[]> {
        return this.prenotazioneService.getMiePrenotazioni();
    }

    deletePrenotazione(id: number): Observable<void> {
        return this.prenotazioneService.deletePrenotazione(id);
    }

    updatePrenotazione(id: number, updates: Partial<Prenotazione>): Observable<Prenotazione> {
        return this.prenotazioneService.updatePrenotazione(id, updates);
    }
} 