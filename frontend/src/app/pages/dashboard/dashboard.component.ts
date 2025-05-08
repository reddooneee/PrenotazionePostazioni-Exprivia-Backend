import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/user.model';
import { Router, RouterModule, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, BarChart, Settings, Calendar, UserCog, ArrowRight } from 'lucide-angular';
import { DashboardService, DashboardCard } from './dashboard.service';
import { forkJoin, Subscription, catchError, of } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LucideAngularModule,
    LoadingComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Stato dell'utente e del dashboard
  isAdmin = false;
  currentUser: User | null = null;
  adminCards: DashboardCard[] = [];
  userCards: DashboardCard[] = [];
  
  // Stati di caricamento e gestione errori
  isLoading = true;
  isChildRouteLoading = false;
  error: string | null = null;
  private routerSubscription: Subscription;

  // Definizione delle icone per il template
  protected readonly icons = {
    users: Users,
    barChart: BarChart,
    settings: Settings,
    calendar: Calendar,
    user: UserCog,
    arrowRight: ArrowRight
  };

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    // Sottoscrizione agli eventi del router per tracciare il caricamento delle route figlie
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isChildRouteLoading = true;
      } else if (event instanceof NavigationEnd || 
                 event instanceof NavigationCancel || 
                 event instanceof NavigationError) {
        this.isChildRouteLoading = false;
      }
    });
  }

  ngOnInit() {
    console.log('Dashboard: Inizializzazione componente...');
    
    // Verifica iniziale dell'autenticazione dell'utente
    if (!this.authService.isAuthenticated()) {
      console.error('Dashboard: Utente non autenticato');
      this.router.navigate(['/']);
      return;
    }

    // Caricamento parallelo dei dati utente e dello stato admin
    forkJoin({
      user: this.dashboardService.getCurrentUser().pipe(
        catchError(error => {
          console.error('Dashboard: Errore nel caricamento dei dati utente:', error);
          this.error = 'Errore nel caricamento dei dati utente';
          return of(null);
        })
      ),
      isAdmin: this.dashboardService.isAdmin().pipe(
        catchError(error => {
          console.error('Dashboard: Errore nel controllo dello stato admin:', error);
          return of(false);
        })
      )
    }).subscribe({
      next: ({ user, isAdmin }) => {
        console.log('Dashboard: Dati utente caricati:', user);
        console.log('Dashboard: Stato admin:', isAdmin);
        
        // Verifica della presenza dei dati utente
        if (!user) {
          this.error = 'Impossibile caricare i dati utente';
          this.isLoading = false;
          return;
        }
        
        // Aggiornamento dello stato del componente
        this.currentUser = user;
        this.isAdmin = isAdmin;
        
        // Caricamento delle card appropriate in base al ruolo
        this.adminCards = this.dashboardService.getAdminCards();
        this.userCards = this.dashboardService.getUserCards();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard: Errore durante l\'inizializzazione:', error);
        this.error = 'Si è verificato un errore durante l\'inizializzazione';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    // Pulizia della sottoscrizione al router
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Navigazione alle route figlie
  navigateTo(route: string) {
    console.log('Dashboard: Navigazione verso', route);
    this.router.navigate([`/dashboard/${route}`]);
  }

  // Verifica se è attiva una route figlia
  hasActiveChildRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl !== '/dashboard';
  }

  // Riprova l'inizializzazione in caso di errore
  retryInitialization() {
    this.error = null;
    this.isLoading = true;
    this.ngOnInit();
  }
}
