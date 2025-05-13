import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from './login.service';
import { authAnimations } from '../shared/animations/auth.animations';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterLink,
    LucideAngularModule,
    MatIconModule
  ],
  animations: [
    authAnimations.fadeIn,
    authAnimations.slideUp,
    authAnimations.shake,
    authAnimations.scaleIn
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePwd: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  iconName: string = 'eye-off';


  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.loginService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.isLoading = false;
          if (user) {
            // Successful login, navigate to dashboard
            const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/dashboard';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.errorMessage = 'Errore durante il login. Riprova.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Credenziali non valide. Riprova.';
          console.error('Login error:', error);
        }
      });
    }
  }

  // Funzione per cambiare l'icona della password
  togglePasswordIcon() {
    this.iconName = this.iconName === 'eye' ? 'eye-off' : 'eye';
  }

  get emailInvalid(): boolean {
    const control = this.loginForm.get('email');
    return control ? (control.dirty || control.touched) && control.invalid : false;
  }

  get passwordInvalid(): boolean {
    const control = this.loginForm.get('password');
    return control ? (control.dirty || control.touched) && control.invalid : false;
  }
}
