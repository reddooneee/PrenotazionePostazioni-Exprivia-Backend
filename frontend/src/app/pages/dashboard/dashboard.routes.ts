import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'user-management',
        loadComponent: () => import('./user-management/user-list.component').then(m => m.UserListComponent),
        data: { authorities: ['ROLE_ADMIN'] },
        canActivate: [UserRouteAccessService]
      },
      {
        path: 'prenotazione-posizione',
        loadComponent: () => import('./prenotazione-posizione/prenotazione-posizione.component').then(m => m.PrenotazionePosizioneComponent),
        data: { authorities: ['ROLE_USER', 'ROLE_ADMIN'] },
        canActivate: [UserRouteAccessService]
      }
    ]
  }
]; 