import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkspaceOption } from '@core/interfaces/workspace.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = `${environment.apiUrl}/workspaces`;

  constructor(private http: HttpClient) {}

  getWorkspaces(): Observable<WorkspaceOption[]> {
    return this.http.get<WorkspaceOption[]>(this.apiUrl);
  }

  getWorkspaceAvailability(id: number, date: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/availability/${date}`);
  }
} 