import { Postazione } from './postazione.model';
import { TipoStanza } from './enums';

export interface Stanza {
    id_stanza?: number;
    nome?: string;
    tipo_stanza?: string;
    capacita_stanza?: number;
    postazioni?: Postazione[];
}

export interface StanzaWithPostazioni extends Stanza {
    id_stanza: number;
    nome: string;
    tipo_stanza: string;
    capacita_stanza: number;
    postazioni: Postazione[];
} 
