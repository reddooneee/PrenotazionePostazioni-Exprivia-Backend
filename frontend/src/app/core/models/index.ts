// Enums
export enum StatoPostazione {
  DISPONIBILE = "Disponibile",
  OCCUPATO = "Occupato",
  MANUTENZIONE = "Manutenzione",
}

export enum TipoStanza {
  MEETINGROOM = "MEETINGROOM",
  OPENSPACE = "OPENSPACE",
  UFFICIO = "UFFICIO",
}

export interface WorkspaceAvailability {
  id: string;
  name: string;
  status: "available" | "reserved" | "occupied";
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

export * from "./user.model";
export * from "./stanza.model";
export * from "./postazione.model";
export * from "./prenotazione.model";
export * from "./auth.model";
export * from "./enums";