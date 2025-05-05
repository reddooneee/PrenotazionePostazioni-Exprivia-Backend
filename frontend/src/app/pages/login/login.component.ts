import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core/auth/auth.service";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Router } from "@angular/router";
import { MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    MatLabel,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Iniezione tramite inject
  private authService = inject(AuthService);
  private router = inject(Router);

  hidePwd = true;


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  // Metodo per il login
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.isLoading = true;
      this.errorMessage = '';
  
      this.authService.loginUser(email, password).subscribe({
        next: (res) => {
          localStorage.setItem('jwt_token', res.token);
          this.isLoading = false;
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Credenziali errate, riprova.';
          console.error(err);
        }
      });
    }
  }
}
