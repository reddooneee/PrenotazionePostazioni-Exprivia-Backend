import { Routes } from '@angular/router';
// import { BookingComponent } from './components/booking/booking.component';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    // {
    //     path: 'reservation',
    //     component: BookingComponent,
    //     canActivate: [AuthGuard], // Protegge la rotta con AuthGuard
    // },
    { path: '**', redirectTo: 'login' }, // Redirect invalid routes to login
];
