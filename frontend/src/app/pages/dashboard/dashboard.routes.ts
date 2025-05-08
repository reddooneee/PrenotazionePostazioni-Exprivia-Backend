import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'user-management',
        loadComponent: () => import('./user-management/user-management.component')
          .then(m => m.UserManagementComponent),
        data: { authorities: ['ROLE_ADMIN'] }
      },
      {
        path: 'bookings',
        loadComponent: () => import('./user-bookings/user-bookings.component')
          .then(m => m.UserBookingsComponent),
        data: { authorities: ['ROLE_USER'] }
      }
    ]
  }
]; 