import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../core/auth/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <main class="flex min-h-screen items-center justify-center px-4 py-12">
      <div class="w-full max-w-md p-8 shadow-lg bg-white flex flex-col rounded-xl">
        <div class="space-y-2.5 mb-8">
          <h1 class="text-2xl font-bold">Registrazione</h1>
          <p class="text-gray-400">
            Crea il tuo account per accedere al sistema di prenotazione
          </p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <!-- Nome -->
          <mat-form-field class="example-full-width">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="nome" placeholder="Inserisci il tuo nome" />
            <mat-error *ngIf="registerForm.get('nome')?.hasError('required')">
              Nome <strong>richiesto</strong>
            </mat-error>
          </mat-form-field>

          <!-- Cognome -->
          <mat-form-field class="example-full-width">
            <mat-label>Cognome</mat-label>
            <input matInput formControlName="cognome" placeholder="Inserisci il tuo cognome" />
            <mat-error *ngIf="registerForm.get('cognome')?.hasError('required')">
              Cognome <strong>richiesto</strong>
            </mat-error>
          </mat-form-field>

          <!-- Email -->
          <mat-form-field class="example-full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="nome.cognome@exprivia.com" />
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              Email <strong>richiesta</strong>
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              Inserisci una mail valida
            </mat-error>
          </mat-form-field>

          <!-- Password -->
          <mat-form-field class="example-full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Inserisci la password" />
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              Password <strong>richiesta</strong>
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              La password deve essere di almeno 6 caratteri
            </mat-error>
          </mat-form-field>

          <!-- Submit Button -->
          <button type="submit" [disabled]="registerForm.invalid"
            class="bg-expriviaOrange font-medium rounded-lg text-white text-sm px-5 py-4 text-center me-2 mb-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            Registrati
          </button>

          <!-- Login Link -->
          <div class="text-center text-sm mt-4">
            Hai già un account?
            <a [routerLink]="['/accedi']" class="text-expriviaOrange underline-offset-4 hover:underline">
              Accedi
            </a>
          </div>
        </form>
      </div>
    </main>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const userData: User = this.registerForm.value;
        await this.userService.registerUser(userData);
        
        // Show success message
        this.snackBar.open('Registrazione completata con successo! Ora puoi effettuare il login.', 'Chiudi', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // Redirect to login page
        this.router.navigate(['/accedi']);
      } catch (error: any) {
        console.error('Registration error:', error);
        this.snackBar.open('Errore durante la registrazione. Riprova più tardi.', 'Chiudi', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    }
  }
}
