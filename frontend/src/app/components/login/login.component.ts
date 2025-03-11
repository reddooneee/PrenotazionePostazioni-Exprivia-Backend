import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { LucideAngularModule } from "lucide-angular";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-login",
  standalone: true, // ✅ Indica che è un componente standalone
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, LucideAngularModule, MatInputModule, MatTabsModule], // ✅ Importa i moduli necessari
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private fb = inject(FormBuilder); // ✅ Usa inject() per Angular 16+
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  registerForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (this.loginForm.valid) {
      console.log("Login attempted with:", this.loginForm.value);
      this.router.navigate(["/dashboard"]);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log("Registration attempted with:", this.registerForm.value);
      this.router.navigate(["/dashboard"]);
    }
  }
}