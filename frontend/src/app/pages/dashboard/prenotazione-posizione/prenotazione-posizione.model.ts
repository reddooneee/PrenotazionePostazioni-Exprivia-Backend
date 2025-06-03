import { User, Postazione, Stanza, StatoPrenotazione, Prenotazione } from '@core/models';
import { StanzaWithPostazioni } from '@core/models/stanza.model';
import { PostazioneWithStanza } from '@core/models/postazione.model';
import { CosaDurata } from '@core/models/cosa-durata.model';

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
    timeSlot: string;
    selectedDate: Date;
    note?: string;
}

export interface BookingState {
    stanze: StanzaWithPostazioni[];
    postazioniDisponibili: PostazioneDisponibile[];
    selectedDates: Date[];
    availableTimeSlots: string[];
    isLoading: boolean;
    errorMessage: string;
}

export interface PostazioneDisponibile {
    id_postazione: number;
    nomePostazione: string;
    stanza_id: number;
    stanza_nome: string;
    tipo_stanza: string;
}

export interface BookingValidationError {
    field: keyof BookingFormData;
    message: string;
}

export interface PrenotazioneRequest {
    id_stanza: number;
    id_postazione: number;
    data_inizio: string;
    data_fine: string;
    cosa_durata?: string | null;
}