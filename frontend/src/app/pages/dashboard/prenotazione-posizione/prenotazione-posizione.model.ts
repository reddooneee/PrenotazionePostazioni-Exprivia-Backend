import { User, Postazione, Stanza, StatoPrenotazione, Prenotazione } from '@core/models';
import { StanzaWithPostazioni } from '@core/models/stanza.model';
import { PostazioneWithStanza } from '@core/models/postazione.model';

export interface PrenotazionePosizione extends Omit<Prenotazione, 'users'> {
    users: Required<User>;
    postazione: Required<Postazione>;
    stanze: Required<Stanza>;
    stato_prenotazione: StatoPrenotazione;
    data_inizio: string;
    data_fine: string;
}

export interface BookingFormData {
    tipo_stanza: string;
    id_stanza: number;
    id_postazione: number;
    data: Date[];
    ora_inizio: string;
    ora_fine: string;
}

export interface BookingState {
    stanze: StanzaWithPostazioni[];
    postazioniDisponibili: PostazioneWithStanza[];
    selectedDates: Date[];
    availableTimeSlots: string[];
    isLoading: boolean;
    errorMessage: string;
}

export interface TimeSlot {
    start: string;
    end: string;
} 