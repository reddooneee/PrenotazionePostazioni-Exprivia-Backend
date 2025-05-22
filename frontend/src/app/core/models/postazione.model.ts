import { Stanza } from './stanza.model';
import { StatoPostazione } from './enums';

export interface PostazioneStanza {
    id_stanza: number;
    nome: string;
    postazioni: Postazione[];
}

export interface Postazione {
    id_postazione?: number;
    nomePostazione?: string;
    stanza_id?: number;
    creatoIl?: string[];
    aggiornatoIl?: string[];
}

export interface PostazioneWithStanza extends Postazione {
    id_postazione: number;
    nomePostazione: string;
    stanza_id: number;
    stanza_nome?: string;
    tipo_stanza?: string;
} 

