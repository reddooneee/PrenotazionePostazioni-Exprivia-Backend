import { User } from './user.model';
import { Postazione } from './postazione.model';
import { Stanza } from './stanza.model';
import { CosaDurata } from './cosa-durata.model';

export enum StatoPrenotazione {
    Confermata = 'Confermata',
    Annullata = 'Annullata',
    InAttesa = 'InAttesa'
}

export interface Authority {
    name: string;
    users: (number | PrenotazioneUser)[];
}

export interface PrenotazioneUser {
    id_user: number;
    nome: string;
    cognome: string;
    email: string;
    password: string;
    verificationCode: string | null;
    verificationCodeExpiresAt: string | null;
    enabled: boolean;
    authorities: Authority[];
    prenotazioni: Prenotazione[];
    creatoIl: number[];
    aggiornatoIl: number[];
}

export interface PrenotazionePostazione {
    id_postazione: number;
    nomePostazione: string;
    creatoIl: number[];
    aggiornatoIl: number[];
}

export interface PrenotazioneStanza {
    id_stanza: number;
    nome: string;
    postazioni: (number | PrenotazionePostazione)[];
    prenotazioni: Prenotazione[];
}

export interface Prenotazione {
    id_prenotazioni?: number;
    data_inizio: Date | string;
    data_fine: Date | string;
    stato_prenotazione: StatoPrenotazione;
    users?: User;
    postazione?: Postazione;
    stanze?: Stanza;
}

export interface PrenotazioneRequest {
    id_postazione: number;
    id_stanza: number;
    data_inizio: string;
    data_fine: string;
}

export interface PrenotazioneResponse extends Prenotazione {
    id_prenotazioni: number;
    users: Required<User>;
    postazione: Required<Postazione>;
    stanze: Required<Stanza>;
}

export interface PrenotazioneFilter {
    startDate?: Date;
    endDate?: Date;
    postazioneId?: number;
    stanzaId?: number;
    userId?: number;
    stato?: StatoPrenotazione;
}

export interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
} 