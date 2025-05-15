// Enums
export enum StatoPostazione {
    DISPONIBILE = 'DISPONIBILE',
    OCCUPATO = 'OCCUPATO',
    MANUTENZIONE = 'MANUTENZIONE'
}

export enum TipoStanza {
    MEETINGROOM = 'MEETINGROOM',
    OPENSPACE = 'OPENSPACE',
    UFFICIO = 'UFFICIO'
}

export enum StatoPrenotazione {
    CONFERMATA = 'CONFERMATA',
    ANNULLATA = 'ANNULLATA',
    IN_ATTESA = 'IN_ATTESA'
}

// UI Models
export interface BookingDetail {
    selectedType: string;
    selectedFloor: string;
    selectedWorkspace: string;
    selectedTime: string;
    dipendenti: string[];
}

export interface TimeSlotBooking {
    date: Date;
    hour: string;
    booking: string | null;
}

export interface WorkspaceAvailability {
    id: string;
    name: string;
    status: 'available' | 'reserved' | 'occupied';
    selected: boolean;
}

export interface FloorPlanMarker {
    id: string;
    x: number;
    y: number;
    room: string;
    workstation: string;
    available: boolean;
}

export interface User {
    id_user?: number;
    nome: string;
    cognome: string;
    email: string;
    password?: string;
    enabled: boolean;
    authorities: string[];
    creatoIl?: string;
    aggiornatoIl?: string;
}

export interface Stanza {
    id_stanza?: number;
    nome: string;
    piano?: number;
    tipo_stanza: TipoStanza;
    capacita_stanza: number;
    postazioni?: Postazione[];
    creatoIl?: string;
    aggiornatoIl?: string;
}

export interface Postazione {
    id_postazione?: number;
    stato_postazione: StatoPostazione;
    stanza?: Stanza;
    prenotazioni?: Prenotazione[];
    creatoIl?: string;
    aggiornatoIl?: string;
}

export interface Prenotazione {
    id_prenotazione?: number;
    user: User;
    postazione?: Postazione;
    stanza?: Stanza;
    stato_prenotazione: StatoPrenotazione;
    data_inizio: string;
    data_fine: string;
    creatoIl?: string;
    aggiornatoIl?: string;
}

export * from './user.model';
export * from './stanza.model';
export * from './postazione.model';
export * from './prenotazione.model';
export * from './auth.model';
export * from './enums'; 