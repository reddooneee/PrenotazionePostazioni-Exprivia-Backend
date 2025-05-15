export interface WorkspaceOption {
  id: string;
  name: string;
  status: string;
  selected: boolean;
}

export interface WorkspaceData {
  id: string;
  name: string;
  floor: string;
  type: string;
}

export interface FloorPlanMarker {
  id: string;
  x: number;
  y: number;
  room: string;
  workstation: string;
  available: boolean;
}

export interface PostazioneSelezionataEvent {
  stanza: string;
  postazione: string;
} 