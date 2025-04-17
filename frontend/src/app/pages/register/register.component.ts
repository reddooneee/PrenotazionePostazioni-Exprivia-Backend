import { Component, inject, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router"; // Importa solo Router (non RouterLink)
import { AuthService } from "../../core/auth/auth.service"; // Se usi AuthService
import { User } from "../../core/auth/user.model";

@Component({
  selector: "app-register",
  standalone: true,
  templateUrl: "./register.component.html",
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatLabel,
    RouterModule // Aggiungi MatSelectModule
  ],
})
export class RegisterComponent {
  registerForm: FormGroup; // Dichiara il form
  private authService = inject(AuthService); // Inietta il servizio utente

  // Inietta il Router nel costruttore
  constructor(private fb: FormBuilder, private router: Router) {
    // Inizializza il form con FormBuilder
    this.registerForm = this.fb.group({
      nome: ["", Validators.required],
      cognome: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      enabled: [true]
    });
  }

  onSubmit() {
    console.log('Submit triggered');
    console.log('Form stato valido:', this.registerForm.valid);
    console.log('Valori form:', this.registerForm.value);
  
    if (this.registerForm.invalid) {
      console.warn('Form non valido, abort');
      return;
    }
  
    const user: User = {
      ...this.registerForm.value,
      enabled: true
    };
  
    this.authService.registerUser(user).subscribe({
      next: (res) => console.log('Registrazione completata', res),
      error: (err) => console.error('Errore durante la registrazione:', err)
    });
  }
}
