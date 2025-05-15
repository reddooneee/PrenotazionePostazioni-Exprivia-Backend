import { Component, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ResetPasswordService } from "./resetpwd.service";

// Validator corretto
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-resetpwd',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './resetpwd.component.html'
})
export class ResetpwdComponent implements OnInit {
  resetPwdForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: passwordMatchValidator });

  private token = '';
  isLoading = false;
  hideNewPwd = true;
  hideConfirmPwd = true;
  errorMessage: string | null = null;

  constructor(
    private resetPwdService: ResetPasswordService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.showError('Token mancante. Richiedi un nuovo link di reset.');
        this.router.navigate(['/account/password/forgot']);
      }
    });
  }

  get passwordInvalid() {
    const control = this.resetPwdForm.get('password');
    return control && control.invalid && (control.dirty || control.touched);
  }

  get confirmPasswordInvalid() {
    const control = this.resetPwdForm.get('confirmPassword');
    return (control && control.invalid && (control.dirty || control.touched)) ||
      (this.resetPwdForm.errors && this.resetPwdForm.errors['passwordMismatch'] && (control?.dirty || control?.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.resetPwdForm.valid && this.token) {
      this.isLoading = true;
      this.errorMessage = null;

      try {
        const password = this.resetPwdForm.get('password')?.value;
        if (!password) {
          throw new Error('Password non valida');
        }

        await this.resetPwdService.resetPassword(this.token, password);
        
        this.showSuccess('Password cambiata con successo!');
        await this.router.navigate(['/accedi']);
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Errore durante il cambio password';
        this.showError(this.errorMessage);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}