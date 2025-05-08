import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../core/auth/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registrazione
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
              <div class="mt-1">
                <input id="nome" name="nome" type="text" formControlName="nome"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-expriviaBlue focus:border-expriviaBlue sm:text-sm">
              </div>
              <div *ngIf="registerForm.get('nome')?.invalid && registerForm.get('nome')?.touched" class="text-red-500 text-sm mt-1">
                Nome è obbligatorio
              </div>
            </div>

            <div>
              <label for="cognome" class="block text-sm font-medium text-gray-700">Cognome</label>
              <div class="mt-1">
                <input id="cognome" name="cognome" type="text" formControlName="cognome"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-expriviaBlue focus:border-expriviaBlue sm:text-sm">
              </div>
              <div *ngIf="registerForm.get('cognome')?.invalid && registerForm.get('cognome')?.touched" class="text-red-500 text-sm mt-1">
                Cognome è obbligatorio
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1">
                <input id="email" name="email" type="email" formControlName="email"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-expriviaBlue focus:border-expriviaBlue sm:text-sm">
              </div>
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                Email non valida
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input id="password" name="password" type="password" formControlName="password"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-expriviaBlue focus:border-expriviaBlue sm:text-sm">
              </div>
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-sm mt-1">
                Password deve essere di almeno 6 caratteri
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="registerForm.invalid"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-expriviaOrange hover:bg-expriviaOrange400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-expriviaBlue disabled:opacity-50 disabled:cursor-not-allowed">
                Registrati
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
