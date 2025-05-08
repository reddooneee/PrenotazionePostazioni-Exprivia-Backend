import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "./login.service";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  hidePwd: boolean = true;

  private loginService = inject(LoginService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],  // Password minimo 6 caratteri
    });
  }

  onSubmit(): void {
    this.loginService
      .login({
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      })
      .subscribe({
        next: () => {
          // Ottieni l'URL di ritorno dai parametri della query o usa l'URL predefinito
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
      });
  }

  // Metodo per verificare se il controllo è stato toccato e se è valido
  get emailInvalid() {
    return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
  }

  get passwordInvalid() {
    return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
  }
}
