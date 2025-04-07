import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { login } from "../../model/login.model";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})

export class LoginComponent {
  loginForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  errorMessage: string = ''; // Variabile per il messaggio di errore

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      login: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // Metodo per gestire il login
  async onSubmit() {
    if (this.loginForm.valid) {
      const loginData: login = this.loginForm.value;
      try {
        const response = await this.authService.login(loginData);
        console.log("Login riuscito:", response);
        alert("Login riuscito:")
        // Redirect o salvataggio dati utente qui
      } catch (error) {
        console.error("Errore durante il login:", error);
        this.errorMessage = "Credenziali non valide";
      }
    } else {
      this.errorMessage = "Compila correttamente tutti i campi!";
    }
  }
  
}