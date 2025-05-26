import { Routes } from '@angular/router';
import { UpdateUserComponent } from '../../account/update-user/update-user.component';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';

export const HEADER_ROUTES: Routes = [
{
path: 'update-user',
    component: UpdateUserComponent,
    children: [
        {
                path: 'update-user',
                loadComponent: () => import('../../account/update-user/update-user.component').then(m => m.UpdateUserComponent),  
                data: { authorities: ['ROLE_ADMIN', 'ROLE_USER'] },
                canActivate: [UserRouteAccessService]
              },
            ]

    } 
]