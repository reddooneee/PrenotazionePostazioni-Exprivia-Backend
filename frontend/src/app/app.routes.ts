import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { RegisterComponent } from "./account/register/register.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ForgotpwdComponent } from "./account/password/forgot-password/forgotpwd.component";
import { ResetpwdComponent } from "./account/password/reset-password/resetpwd.component";
import { AuthGuard } from "./core/auth/auth.guard";
import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { UserManagementComponent } from "./pages/dashboard/user-management/user-management.component";
import { UserBookingsComponent } from "./pages/dashboard/user-bookings/user-bookings.component";
import { inject } from "@angular/core";
import { AuthService } from "./core/auth/auth.service";
import { Router } from "@angular/router";

// Guard to redirect authenticated users to dashboard
const redirectAuthenticatedToDashboard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};

// Definisci le rotte
export const routes: Routes = [
  { 
    path: "", 
    component: HomeComponent,
    canActivate: [() => redirectAuthenticatedToDashboard()]
  },
  { path: "registrazione", component: RegisterComponent },
  { path: "accedi", component: LoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['ROLE_USER', 'ROLE_ADMIN'] },
    children: [
      {
        path: 'user-management',
        component: UserManagementComponent,
        data: { authorities: ['ROLE_ADMIN'] }
      },
      {
        path: 'bookings',
        component: UserBookingsComponent,
        data: { authorities: ['ROLE_USER'] }
      },
      // Add other dashboard routes here
      { path: '', redirectTo: 'bookings', pathMatch: 'full' }
    ]
  },
  { path: "forgot-password", component: ForgotpwdComponent },
  { path: "reset-password", component: ResetpwdComponent },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "**", redirectTo: "" }
];
