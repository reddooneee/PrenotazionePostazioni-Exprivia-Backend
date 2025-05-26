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
import { UpdateUserComponent } from "./account/update-user/update-user.component";

// Guard to redirect authenticated users to prenotazione-posizione
const redirectAuthenticatedToPrenotazione = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(["/dashboard/prenotazione-posizione"]);
  }
  return true;
};

// Definisci le rotte
export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [() => redirectAuthenticatedToPrenotazione()],
  },
  {
    path: "registrazione",
    component: RegisterComponent,
    canActivate: [() => redirectAuthenticatedToPrenotazione()],
  },
  {
    path: "accedi",
    component: LoginComponent,
    canActivate: [() => redirectAuthenticatedToPrenotazione()],
  },
  {
    path: "update-user",
    component: UpdateUserComponent,
    canActivate: [() => redirectAuthenticatedToPrenotazione()],
  },

  {
    path: "dashboard",
    loadChildren: () =>
      import("./pages/dashboard/dashboard.routes").then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forgot-password",
    component: ForgotpwdComponent,
    canActivate: [() => redirectAuthenticatedToPrenotazione()],
  },
  {
    path: "reset-password",
    component: ResetpwdComponent,
    canActivate: [() => redirectAuthenticatedToPrenotazione()],
  },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "**", redirectTo: "" },
];
