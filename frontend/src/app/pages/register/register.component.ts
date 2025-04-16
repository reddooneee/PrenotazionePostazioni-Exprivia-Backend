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
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select"; // Importa MatSelectModule
import { Router, RouterModule } from "@angular/router"; // Importa solo Router (non RouterLink)
import { AuthService } from "../../core/auth/auth.service"; // Se usi AuthService
import { UserService } from "../../service/user.service"; // Se usi UserService
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
    });
  }

  // Funzione per registrare l'utente
  async onSubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      console.log("Dati del form:", user);
  
      try {
        console.log("Invio richiesta...");
        const response = await this.authService.registerUser(user);
        console.log("Risposta dal backend:", response);
        alert("Registrazione avvenuta con successo!");
        this.router.navigate(['/login']);
      } catch (error) {
        console.error("Errore durante la registrazione:", error);
        alert("Errore durante la registrazione.");
      }
    } else {
      console.warn("Form non valido");
    }
  }  
}
