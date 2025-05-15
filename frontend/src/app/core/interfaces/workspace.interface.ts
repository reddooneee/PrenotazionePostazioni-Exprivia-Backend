export interface WorkspaceOption {
  id: string;
  name: string;
  type: string;
  floor: number;
  capacity: number;
}

export interface FloorPlanMarker {
  id: string;
  x: number;
  y: number;
  status: string;
  type: string;
}

export interface PostazioneSelezionataEvent {
  id: string;
  status: string;
}

export interface WorkspaceData {
  id: string;
  name: string;
  type: string;
  status: string;
  floor: number;
  capacity: number;
  coordinates?: {
    x: number;
    y: number;
  };
} 