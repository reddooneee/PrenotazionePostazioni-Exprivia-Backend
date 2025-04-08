import { Component } from "@angular/core";
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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOption, MatSelectModule } from "@angular/material/select"; // Importa MatSelectModule
import { RouterLink } from "@angular/router";
import { UserService } from "../../service/user.service";
import { User } from "../../model/user.model";

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
    RouterLink,
    MatOption,
    MatSelectModule, // Aggiungi MatSelectModule
  ],
})
export class RegisterComponent {
  registerForm: FormGroup; // Dichiara il form

  ruoliUtente = ["Amministratore", "BuildingManager", "Dipendente"]; // Enum convertito in array

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Inizializza il form con FormBuilder
    this.registerForm = this.fb.group({
      nome: ["", Validators.required],
      cognome: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      ruolo_utente: ["", Validators.required],
    });
  }

  // Funzione per registrare l'utente
  async onSubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      console.log("Dati del form:", user); // Log dei dati per verificare che vengano correttamente letti

      try {
        const response = await this.userService.registerUser(user);
        alert("Registrazione avvenuta con successo!");
        console.log(response); // Verifica la risposta
      } catch (error) {
        console.error("Errore durante la registrazione:", error);
        alert("Errore durante la registrazione.");
      }
    } else {
      console.log("Il form non è valido:", this.registerForm); // Log per vedere se il form è valido
      alert("Compila correttamente tutti i campi.");
    }
  }
}
