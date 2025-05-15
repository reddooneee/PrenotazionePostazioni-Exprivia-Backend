import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../core/auth/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterService } from './register.service';
import { authAnimations } from '../../shared/animations/auth.animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  animations: [
    authAnimations.fadeIn,
    authAnimations.slideUp,
    authAnimations.shake,
    authAnimations.scaleIn
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  private registerService = inject(RegisterService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  hidePwd = true;
  hideConfirmPwd = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get emailInvalid() {
    const control = this.registerForm.get('email');
    return control && control.invalid && (control.dirty || control.touched);
  }
  get passwordInvalid() {
    const control = this.registerForm.get('password');
    return control && control.invalid && (control.dirty || control.touched);
  }
  get confirmPasswordInvalid() {
    const control = this.registerForm.get('confirmPassword');
    return (control && control.invalid && (control.dirty || control.touched)) ||
      (this.registerForm.errors && this.registerForm.errors['passwordMismatch'] && (control?.dirty || control?.touched));
  }

  onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { nome, cognome, email, password } = this.registerForm.value;
        const userData: User = { nome, cognome, email, password };
        this.registerService.registerUser(userData);
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
