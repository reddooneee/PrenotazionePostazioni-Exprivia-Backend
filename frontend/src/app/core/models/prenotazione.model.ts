import { User } from './user.model';
import { Postazione } from './postazione.model';
import { StatoPrenotazione } from './enums';

export interface Prenotazione {
    id_prenotazione?: number;
    user?: User;
    postazione?: Postazione;
    data_prenotazione: string;
    stato_prenotazione: StatoPrenotazione;
    creatoIl?: string;
    aggiornatoIl?: string;
} 