import { Component, inject } from "@angular/core";
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../core/auth/auth.service";
import { RouterModule } from "@angular/router";
@Component({
  selector: 'app-forgotpwd',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    CommonModule,
    

  ],
  templateUrl: './forgotpwd.component.html',
  styleUrl: './forgotpwd.component.css'
})
export class ForgotpwdComponent {
private authService = inject(AuthService);

forgotPwdForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]) 
})
isLoading: boolean = false;

onSubmit() {
  if (this.forgotPwdForm.valid) {
    this.isLoading = true;
    const email = this.forgotPwdForm.value.email!;
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert('Email inviata con successo!');
      },
      error: (err) => {
        this.isLoading = false;
        alert('Errore durante l\'invio dell\'email');
      }
    });
  }
}


}