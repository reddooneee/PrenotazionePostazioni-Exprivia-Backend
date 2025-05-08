import { Injectable } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/user.model';
import { Observable, map } from 'rxjs';

export interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private authService: AuthService) {}

  getCurrentUser(): Observable<User | null> {
    return this.authService.getIdentity();
  }

  isAdmin(): Observable<boolean> {
    return this.authService.getIdentity().pipe(
      map(user => this.authService.hasAnyAuthority(['ROLE_ADMIN']))
    );
  }

  getAdminCards(): DashboardCard[] {
    return [
      {
        title: 'Gestione Utenti',
        description: 'Gestisci gli utenti del sistema e le loro autorizzazioni',
        icon: 'users',
        route: 'user-management',
        action: 'Gestisci Utenti'
      },
      {
        title: 'Statistiche',
        description: 'Visualizza le statistiche e i report del sistema',
        icon: 'bar-chart',
        route: 'statistics',
        action: 'Visualizza Statistiche'
      },
      {
        title: 'Configurazione',
        description: 'Configura le impostazioni del sistema',
        icon: 'settings',
        route: 'settings',
        action: 'Configura'
      }
    ];
  }

  getUserCards(): DashboardCard[] {
    return [
      {
        title: 'Le Mie Prenotazioni',
        description: 'Visualizza e gestisci le tue prenotazioni di postazioni e sale',
        icon: 'calendar',
        route: 'bookings',
        action: 'Gestisci Prenotazioni'
      },
      {
        title: 'Profilo',
        description: 'Gestisci il tuo profilo e le tue preferenze',
        icon: 'user',
        route: 'profile',
        action: 'Modifica Profilo'
      }
    ];
  }
} 