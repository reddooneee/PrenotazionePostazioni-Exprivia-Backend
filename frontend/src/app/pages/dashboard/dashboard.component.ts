import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "../../core/models";
import { Subscription, interval } from "rxjs";
import { map } from "rxjs/operators";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { LoginService } from "../../login/login.service";
import { LucideAngularModule } from "lucide-angular";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../layout/header/header.component";
import {
  UserService,
  PostazioneService,
  PrenotazioneService,
  AxiosService,
  UtilsService,
  AdminService,
} from "@core/services";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { DashboardService } from "./dashboard.service";
import { PrenotazionePosizioneComponent } from "./prenotazione-posizione/prenotazione-posizione.component";
import { UpdateUserComponent } from "../../account/update-user/update-user.component";
import { SidebarService } from "../../shared/services/sidebar.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    SidebarComponent,
    PrenotazionePosizioneComponent,
    HeaderComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
],
  providers: [
    AuthService,
    LoginService,
    UserService,
    PostazioneService,
    PrenotazioneService,
    AxiosService,
    UtilsService,
    AdminService,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isUser = false;
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;
  activeRoute: string = "";

  // Data e ora
  currentDate = new Date();
  currentTime = new Date().toLocaleTimeString();
  private timeSubscription?: Subscription;

  // Dati per la dashboard
  notificationCount = 0;
  
  // Sidebar state
  isSidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private postazioneService: PostazioneService,
    private prenotazioneService: PrenotazioneService,
    private utilsService: UtilsService,
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private sidebarService: SidebarService
  ) {}

  async ngOnInit() {
    // Set rotta attiva
    this.activeRoute = this.router.url;

    // Stato di autenticazione iniziale
    this.updateAuthState();

    // Listener per i cambiamenti di autenticazione
    this.authSubscription = this.authService
      .getAuthenticationState()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.authService.getIdentity().subscribe((user) => {
            this.currentUser = user;
            this.isAdmin = user?.authorities?.includes("ROLE_ADMIN") ?? false;
            this.isUser = user?.authorities?.includes("ROLE_USER") ?? false;
          });
        } else {
          this.currentUser = null;
          this.isAdmin = false;
          this.isUser = false;
        }
      });

    // Aggiorna l'orario ogni secondo
    this.timeSubscription = interval(1000)
      .pipe(map(() => new Date().toLocaleTimeString()))
      .subscribe((time) => {
        this.currentTime = time;
      });

    // Subscribe to sidebar state changes
    this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
    });

    // Dashboard loaded
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  private updateAuthState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.authService.getIdentity().subscribe((user) => {
        this.currentUser = user;
        this.isAdmin = user?.authorities?.includes("ROLE_ADMIN") ?? false;
        this.isUser = user?.authorities?.includes("ROLE_USER") ?? false;
      });
    }
  }

  logout() {
    this.loginService.logout();
  }

  isRouteActive(route: string): boolean {
    const currentRoute = this.activeRoute.replace(/\/$/, "");
    const checkRoute = route.replace(/\/$/, "");

    if (checkRoute === "") {
      return currentRoute === "" || currentRoute === "/";
    }

    if (checkRoute === "/dashboard") {
      return (
        currentRoute === "/dashboard" || currentRoute.startsWith("/dashboard/")
      );
    }

    if (checkRoute === "/accedi") {
      return currentRoute === "/accedi";
    }

    if (checkRoute === "/registrazione") {
      return currentRoute === "/registrazione";
    }

    if (checkRoute === "/dashboard/user-management") {
      return currentRoute === "/dashboard/user-management";
    }

    return (
      currentRoute === checkRoute ||
      (checkRoute !== "/" && currentRoute.startsWith(checkRoute))
    );
  }

  isHomeRoute(): boolean {
    return (
      this.router.url === "/dashboard" || this.router.url === "/dashboard/"
    );
  }

}
