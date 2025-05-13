import { Injectable } from '@angular/core';
import { WorkspaceData, WorkspaceOption, FloorPlanMarker } from '../interfaces/workspace.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private readonly workspacesDatabase: WorkspaceData[] = [
    { id: "A10-56", name: "A10 - Postazione 56", floor: "Stanza A10", type: "Postazione - Giornata intera" },
    { id: "A10-57", name: "A10 - Postazione 57", floor: "Stanza A10", type: "Postazione - Giornata intera" },
    // ... rest of the workspaces
  ];

  getWorkspacesForFloor(floor: string, type: string): WorkspaceOption[] {
    return this.workspacesDatabase
      .filter(workspace => 
        workspace.floor === floor && 
        (workspace.type === type || (type.includes("Sala Riunione") && workspace.type === "Sala Riunione"))
      )
      .map(workspace => ({
        id: workspace.id,
        name: workspace.name,
        status: this.generateRandomStatus(),
        selected: false
      }));
  }

  private generateRandomStatus(): string {
    const random = Math.random();
    if (random < 0.7) return 'available';
    if (random < 0.85) return 'reserved';
    return 'occupied';
  }

  getFloorPlanMarkers(floor: string, availableWorkspaces: string[]): FloorPlanMarker[] {
    const roomCoordinates = this.getRoomCoordinates();
    
    if (roomCoordinates[floor]) {
      const room = floor;
      const roomData = roomCoordinates[room];

      return roomData.workstations.map((workstation, index) => {
        const offsetX = index % 2 === 0 ? -15 : 15;
        const offsetY = index > 1 ? 15 : index > 0 ? -15 : 0;

        return {
          id: `${room}-${index + 1}`,
          x: roomData.x + offsetX,
          y: roomData.y + offsetY,
          room: room,
          workstation: workstation,
          available: availableWorkspaces.includes(workstation)
        };
      });
    }

    return [];
  }

  private getRoomCoordinates(): Record<string, { x: number; y: number; workstations: string[] }> {
    return {
      "Stanza A10": { x: 220, y: 80, workstations: ["A10 - Postazione 56", "A10 - Postazione 57", "A10 - Postazione 58"] },
      // ... rest of the room coordinates
    };
  }
} 