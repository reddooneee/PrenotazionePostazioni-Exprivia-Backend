import { CosaDurata } from './cosa-durata.model';

export enum StatoPrenotazione {
    Confermata = 'Confermata',
    Annullata = 'Annullata',
    InAttesa = 'InAttesa'
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

// Simplified user info from backend
export interface PrenotazioneUser {
    id_user: number;
    nome: string;
    cognome: string;
    email: string;
    enabled: boolean;
}

// Simplified postazione info from backend
export interface PrenotazionePostazione {
    id_postazione: number;
    nomePostazione: string;
}

// Simplified stanza info from backend
export interface PrenotazioneStanza {
    id_stanza: number;
    nome: string;
    tipo_stanza: string;
}

export interface Prenotazione {
    id_prenotazioni?: number;
    data_inizio: Date | string;
    data_fine: Date | string;
    stato_prenotazione: StatoPrenotazione;
    users: PrenotazioneUser;
    postazione: PrenotazionePostazione;
    stanze: PrenotazioneStanza;
}

export interface PrenotazioneRequest {
    id_postazione: number;
    id_stanza: number;
    data_inizio: string;
    data_fine: string;
}

export interface PrenotazioneResponse extends Prenotazione {
    id_prenotazioni: number;
}

export interface PrenotazioneFilter {
    startDate?: Date;
    endDate?: Date;
    postazioneId?: number;
    stanzaId?: number;
    userId?: number;
    stato?: StatoPrenotazione;
} 