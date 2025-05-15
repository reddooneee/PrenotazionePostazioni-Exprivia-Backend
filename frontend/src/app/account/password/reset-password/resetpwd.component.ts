import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { ResetPasswordService } from "./resetpwd.service";


// Validator corretto
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-resetpwd',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './resetpwd.component.html'
})


export class ResetpwdComponent implements OnInit {
  private token = '';
  private resetPwd = inject(ResetPasswordService);
  isLoading: boolean = false;

  hideNewPwd = true;
  hideConfirmPwd = true;

  resetPwdForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: passwordMatchValidator });

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit(): void {
    if (this.resetPwdForm.valid) {
      this.isLoading = true;
      const password = this.resetPwdForm.value.password!;
      this.resetPwd.resetPassword(this.token, password).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Password cambiata con successo!');
        },
        error: () => {
          this.isLoading = false;
          alert('Errore durante il cambio password');
        }
      });
    }
  }
}