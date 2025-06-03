import { Prenotazione } from './prenotazione.model';

export interface CosaDurata {
    nome: string;
    prenotazioni?: Prenotazione[];
}

export interface CosaDurataDTO {
    nome: string;
    prenotazioneIds?: number[];
} 