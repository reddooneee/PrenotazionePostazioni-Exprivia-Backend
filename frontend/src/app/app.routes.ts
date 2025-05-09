import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./login/login.component";
import { ForgotpwdComponent } from "./account/password/forgot-password/forgotpwd.component";
import { ResetpwdComponent } from "./account/password/reset-password/resetpwd.component";
import { AuthGuard } from "./core/auth/auth.guard";
import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { inject } from "@angular/core";
import { AuthService } from "./core/auth/auth.service";
import { Router } from "@angular/router";
import { RegisterComponent } from "./account/register/register.component";

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
  { 
    path: "registrazione", 
    component: RegisterComponent,
    canActivate: [() => redirectAuthenticatedToDashboard()]
  },
  { 
    path: "accedi", 
    component: LoginComponent,
    canActivate: [() => redirectAuthenticatedToDashboard()]
  },
  {
    path: "dashboard",
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]
  },
  { 
    path: "forgot-password", 
    component: ForgotpwdComponent,
    canActivate: [() => redirectAuthenticatedToDashboard()]
  },
  { 
    path: "reset-password", 
    component: ResetpwdComponent,
    canActivate: [() => redirectAuthenticatedToDashboard()]
  },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "**", redirectTo: "" }
];
