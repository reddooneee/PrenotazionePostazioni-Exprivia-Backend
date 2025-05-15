import { Stanza } from './stanza.model';
import { StatoPostazione } from './enums';

export interface Postazione {
    id_postazione?: number;
    stato_postazione: StatoPostazione;
    stanza?: Stanza;
    creatoIl?: string;
    aggiornatoIl?: string;
} 