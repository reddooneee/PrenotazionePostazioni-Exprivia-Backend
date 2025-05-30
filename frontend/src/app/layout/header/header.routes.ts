import { Routes } from '@angular/router';
import { UserRouteAccessService } from '@/app/core/auth/user-route-access.service';

export const HEADER_ROUTES: Routes = [
  {
    path: 'update-user',
    loadComponent: () => import('../../account/update-user/update-user.component').then(m => m.UpdateUserComponent),
    data: { authorities: ['ROLE_USER'] },
    canActivate: [UserRouteAccessService]
  }
]