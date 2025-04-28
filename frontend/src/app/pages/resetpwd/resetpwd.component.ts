import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../core/auth/auth.service";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { AbstractControl, ValidationErrors } from '@angular/forms';


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
    CommonModule
  ],
  templateUrl: './resetpwd.component.html',
  styleUrl: './resetpwd.component.css'
})
export class ResetpwdComponent implements OnInit {
  private token = '';
  private authService = inject(AuthService);
  isLoading: boolean = false;

  resetPwdForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: passwordMatchValidator });

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit(): void {
    if (this.resetPwdForm.valid) {
      this.isLoading = true;
      const password = this.resetPwdForm.value.password!;
      this.authService.resetPassword(this.token, password).subscribe({
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