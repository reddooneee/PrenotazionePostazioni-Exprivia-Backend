import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { DashBoardComponent } from "./pages/dashboard/dashboard.component";
import { ForgotpwdComponent } from "./pages/password/forgotpwd/forgotpwd.component";
import { ResetpwdComponent } from "./pages/password/resetpwd/resetpwd.component";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";
import { AuthGuard } from "./core/auth/auth.guard";
import { PrenotazionePosizioneComponent } from "./pages/prenotazione-posizione/prenotazione-posizione.component";


// Definisci le rotte
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "registrazione", component: RegisterComponent },
    { path: "accedi", component: LoginComponent },
    { 
      path: "dashboard", 
      component: DashBoardComponent, 
      canActivate: [AuthGuard],
      data: { role: 'user' }  // Ruolo "user" per la dashboard generica
    },
    { 
      path: "admin-dashboard", 
      component: AdminDashboardComponent, 
      canActivate: [AuthGuard],
      data: { role: 'admin' }  // Ruolo "admin" per la dashboard dell'amministratore
    },
    { path: "forgot-password", component: ForgotpwdComponent },
    { path: "reset-password", component: ResetpwdComponent },
    { path: "prenotazione-posizione", component: PrenotazionePosizioneComponent},
  ];
  