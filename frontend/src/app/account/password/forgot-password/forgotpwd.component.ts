import { Component, inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { ForgotPasswordService } from "./forgotpwd.service";

@Component({
  selector: 'app-forgotpwd',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './forgotpwd.component.html'
})


export class ForgotpwdComponent {

  
  private forgotPasswordService = inject(ForgotPasswordService);
  private fb = inject(FormBuilder);

  isLoading = false;
  forgotPwdForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotPwdForm.invalid) return;

    this.isLoading = true;
    const email = this.forgotPwdForm.value.email;

    this.forgotPasswordService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading = false;
        // Potresti usare una snackbar o un messaggio UI più elegante
        alert('Controlla la tua email per reimpostare la password.');
      },
      error: () => {
        this.isLoading = false;
        alert('Errore durante l\'invio della richiesta. Riprova più tardi.');
      }
    });
  }
}
