import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from './login.service';
import { authAnimations } from '../shared/animations/auth.animations';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeaderComponent } from '../layout/header/header.component';

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
    MatIconModule,
    HeaderComponent
  ],
  animations: [
    authAnimations.fadeIn,
    authAnimations.slideUp,
    authAnimations.shake,
    authAnimations.scaleIn
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePwd: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  iconName: string = 'eye-off';
  private destroy$ = new Subject<void>();

  private loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', { validators: [Validators.required, Validators.email], nonNullable: true }],
      password: ['', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }]
    });

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.errorMessage) {
          this.errorMessage = null;
        }
      });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoading = false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      
      // Disable form controls while loading
      this.loginForm.disable();

      this.loginService.login(this.loginForm.value)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            this.loginForm.enable();
          })
        )
        .subscribe({
          next: (user) => {
            if (user) {
              const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/dashboard';
              this.router.navigateByUrl(returnUrl);
            }
          },
          error: (error) => {
            console.error('Login error:', {
              message: error.message,
              originalError: error.originalError,
              timestamp: new Date().toISOString()
            });
            
            this.errorMessage = error.message;
            this.loginForm.markAsPristine();
            
            if (error.originalError?.response?.status === 400) {
              const emailControl = this.loginForm.get('email');
              if (emailControl) {
                emailControl.markAsTouched();
                const emailInput = document.getElementById('email') as HTMLInputElement;
                if (emailInput) {
                  emailInput.focus();
                }
              }
            }
          }
        });
    }
  }

  togglePasswordIcon(): void {
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
