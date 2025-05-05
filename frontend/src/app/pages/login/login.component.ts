import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/auth/auth.service";
import { CommonModule } from "@angular/common";
import { MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Router, RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatIcon, MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MatLabel,
      RouterModule,
      MatIconModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  private authService = inject(AuthService); // Inietta il servizio utente
  private router = inject(Router)

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
          // Reindirizzamento
          this.router.navigate(['/dashboard']);  // oppure this.router.navigate(...) se lo hai iniettato
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
