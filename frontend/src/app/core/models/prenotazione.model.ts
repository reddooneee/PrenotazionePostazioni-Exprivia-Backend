import { User } from './user.model';
import { Postazione } from './postazione.model';
import { Stanza } from './stanza.model';
import { StatoPrenotazione } from './enums';

export interface Prenotazione {
    id_prenotazione?: number;
    users?: User;
    postazione?: Postazione;
    stanze?: Stanza;
    stato_prenotazione?: StatoPrenotazione;
    data_inizio?: string;
    data_fine?: string;
}

export interface PrenotazioneRequest {
    id_stanza: number;
    id_postazione: number;
    data_inizio: string;
    data_fine: string;
} 