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
import { User } from "../../model/user.model";
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

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private AuthService: AuthService) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // Metodo per gestire il login
  async onSubmit() {
    if (this.loginForm.valid) {
      const loginData: login = this.loginForm.value;
      try {
        const response = await this.AuthService.login(loginData);
        console.log('Response ricevuta:', response);
        // qui puoi fare redirect, salvare utente in localStorage, ecc.
        alert("Utente Loggato Con Successo")
      } catch (error) {
        console.error('Errore durante il login:', error);
        this.errorMessage = 'Credenziali non valide';
      }
    }
  }
  
}