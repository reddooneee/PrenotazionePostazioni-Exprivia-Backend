import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/user.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Admin Dashboard -->
      <div *ngIf="isAdmin" class="admin-dashboard animate-fade-in">
        <h2 class="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card transform hover:scale-105 transition-transform duration-300">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h5 class="text-xl font-semibold mb-3 text-gray-700">Gestione Utenti</h5>
              <p class="text-gray-600 mb-4">Gestisci gli utenti del sistema</p>
              <button 
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                (click)="navigateTo('user-management')">
                Gestisci Utenti
              </button>
            </div>
          </div>
          <div class="card transform hover:scale-105 transition-transform duration-300">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h5 class="text-xl font-semibold mb-3 text-gray-700">Statistiche</h5>
              <p class="text-gray-600 mb-4">Visualizza le statistiche del sistema</p>
              <button 
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                (click)="navigateTo('statistics')">
                Visualizza Statistiche
              </button>
            </div>
          </div>
          <div class="card transform hover:scale-105 transition-transform duration-300">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h5 class="text-xl font-semibold mb-3 text-gray-700">Configurazione</h5>
              <p class="text-gray-600 mb-4">Configura le impostazioni del sistema</p>
              <button 
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                (click)="navigateTo('settings')">
                Configura
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- User Dashboard -->
      <div *ngIf="!isAdmin" class="user-dashboard animate-fade-in">
        <h2 class="text-3xl font-bold mb-8 text-gray-800">Dashboard Utente</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card transform hover:scale-105 transition-transform duration-300">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h5 class="text-xl font-semibold mb-3 text-gray-700">Le Mie Prenotazioni</h5>
              <p class="text-gray-600 mb-4">Visualizza e gestisci le tue prenotazioni</p>
              <button 
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                (click)="navigateTo('bookings')">
                Gestisci Prenotazioni
              </button>
            </div>
          </div>
          <div class="card transform hover:scale-105 transition-transform duration-300">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h5 class="text-xl font-semibold mb-3 text-gray-700">Profilo</h5>
              <p class="text-gray-600 mb-4">Gestisci il tuo profilo utente</p>
              <button 
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                (click)="navigateTo('profile')">
                Modifica Profilo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Router Outlet for nested routes -->
      <div class="mt-8 animate-fade-in">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
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
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  isAdmin = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getIdentity().subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.hasAnyAuthority(['ROLE_ADMIN']);
      console.log('Dashboard: User loaded, isAdmin:', this.isAdmin);
    });
  }

  navigateTo(route: string) {
    console.log('Dashboard: Navigating to', route);
    this.router.navigate([`/dashboard/${route}`]);
  }
}
