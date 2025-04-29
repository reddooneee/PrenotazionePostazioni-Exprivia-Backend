import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByFloor',
  standalone: true
})
export class FilterByFloorPipe implements PipeTransform {

  transform(workspaces: { floor: string, workspace: string }[], filterFloor: string): { floor: string, workspace: string }[] {
    if (!workspaces || !filterFloor) {
      return workspaces;
    }
    return workspaces.filter(workspace => workspace.floor === filterFloor);
  }

}

