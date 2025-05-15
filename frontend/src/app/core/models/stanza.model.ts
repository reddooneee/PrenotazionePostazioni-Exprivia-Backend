import { Postazione } from './postazione.model';
import { TipoStanza } from './enums';

export interface Stanza {
    id_stanza?: number;
    nome: string;
    postazioni?: Postazione[];
    tipo_stanza: TipoStanza;
    capacita_stanza: number;
    creatoIl?: string;
    aggiornatoIl?: string;
} 