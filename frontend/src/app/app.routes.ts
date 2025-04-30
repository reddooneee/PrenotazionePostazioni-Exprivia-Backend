import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { DashBoardComponent } from "./pages/dashboard/dashboard.component";
import { ForgotpwdComponent } from "./pages/password/forgotpwd/forgotpwd.component";
import { ResetpwdComponent } from "./pages/password/resetpwd/resetpwd.component";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";

// Definisci le rotte
export const routes: Routes = [
    { path: "", component: HomeComponent }, // La home sarà il componente di default
    { path: "registrazione", component: RegisterComponent }, // Rotta per la registrazione
    { path: "accedi", component: LoginComponent }, //rotta per il login
    { path: "dashboard", component: DashBoardComponent }, // Rotta per il dashboard
    { path: "forgot-password", component: ForgotpwdComponent }, // Rotta per il forgot password
    { path: "reset-password", component: ResetpwdComponent }, // Rotta per il reset password
    { path: "admin-dashboard", component: AdminDashboardComponent } //Rotta per la dashboard admin
];
