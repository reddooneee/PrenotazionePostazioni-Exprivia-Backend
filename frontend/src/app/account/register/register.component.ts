import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterService, RegisterUserData } from './register.service';
import { LoginService } from '../../login/login.service';
import { authAnimations } from '../../shared/animations/auth.animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HeaderComponent } from '../../layout/header/header.component';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../shared/services/toast.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    ToastModule,
  ],
  providers: [],
  styleUrls: ['../../shared/styles/toast.styles.css'],
  animations: [
    authAnimations.fadeIn,
    authAnimations.slideUp,
    authAnimations.shake,
    authAnimations.scaleIn
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePwd = true;
  hideConfirmPwd = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    });

    // Add password match validation when either password or confirmPassword changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('confirmPassword')?.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  }

  // Updated password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!control || !this.registerForm) {
      return null;
    }
    
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = control.value;
    
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
    return control && control.invalid && (control.dirty || control.touched);
  }

  getPasswordErrorMessage(): string {
    const control = this.registerForm.get('password');
    if (control?.hasError('required')) {
      return 'La password è obbligatoria';
    }
    if (control?.hasError('minlength')) {
      return 'La password deve contenere almeno 6 caratteri';
    }
    if (control?.hasError('pattern')) {
      return 'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.registerForm.get('confirmPassword');
    if (control?.hasError('required')) {
      return 'La conferma password è obbligatoria';
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Le password non coincidono';
    }
    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const formData = this.registerForm.value;
      const userData: RegisterUserData = {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        password: formData.password
      };

      // Register the user and then automatically log them in
      this.registerService.register(userData)
        .pipe(
          switchMap(() => {
            // After successful registration, automatically log the user in
            return this.loginService.login({
              email: userData.email,
              password: userData.password
            });
          }),
          catchError(error => {
            console.error('Registration or login error:', error);
            
            // Check if error is from registration or login phase
            if (error.originalError) {
              // This is likely a login error after successful registration
              this.showWarningToast(
                'Registrazione Completata',
                'Si è verificato un errore durante il login automatico. Puoi effettuare il login manualmente.'
              );
              // Navigate to login page if auto-login fails
              this.router.navigate(['/accedi']);
              return throwError(() => new Error('Auto-login failed'));
            } else {
              // This is a registration error
              const message = error.response?.data?.message || 'Errore durante la registrazione. Riprova più tardi.';
              this.showErrorToast('Errore Registrazione', message);
              return throwError(() => new Error(message));
            }
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (user) => {
            if (user) {
              // Navigate to dashboard after successful auto-login
              this.router.navigate(['/dashboard']);
            }
          }
        });
    }
  }

  // Toast utility methods for consistent styling and messaging
  private showSuccessToast(summary: string, detail: string): void {
    this.toastService.showSuccess(summary, detail);
  }

  private showErrorToast(summary: string, detail: string): void {
    this.toastService.showError(summary, detail);
  }

  private showInfoToast(summary: string, detail: string): void {
    this.toastService.showInfo(summary, detail);
  }

  private showWarningToast(summary: string, detail: string): void {
    this.toastService.showWarning(summary, detail);
  }

  // Clear all existing toasts
  private clearAllToasts(): void {
    this.toastService.clearAll();
  }
}
