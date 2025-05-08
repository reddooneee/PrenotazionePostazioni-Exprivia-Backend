import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h1 class="display-4">403</h1>
          <h2>Accesso Negato</h2>
          <p class="lead">Non hai i permessi necessari per accedere a questa pagina.</p>
          <button class="btn btn-primary" (click)="goHome()">Torna alla Home</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 60vh;
      display: flex;
      align-items: center;
    }
  `]
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
} 