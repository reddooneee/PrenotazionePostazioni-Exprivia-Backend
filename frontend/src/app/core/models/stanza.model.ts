import { Postazione } from './postazione.model';

export interface Stanza {
    id_stanza: number;
    nome: string;
    tipo_stanza: string;
    postazioni?: Postazione[];
}

export interface StanzaWithPostazioni extends Stanza {
    postazioni: Postazione[];
} 
