// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class RegisterComponent implements OnInit {
//   registerForm: FormGroup;
//   isSubmitting = false;
//   errorMessage = '';

//   constructor(
//     private formBuilder: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.registerForm = this.formBuilder.group(
//       {
//         name: ['', [Validators.required, Validators.minLength(3)]],
//         lastName: ['', [Validators.required, Validators.minLength(3)]],
//         email: ['', [Validators.required, Validators.email]],
//         password: ['', [Validators.required, Validators.minLength(6)]],
//         confirmPassword: ['', [Validators.required]],
//       },
//       { validators: passwordMatchValidator }
//     );
//   }

//   ngOnInit(): void {
//     if (this.authService.isAuthenticated()) {
//       this.router.navigate(['/booking']);
//     }
//   }

//   onSubmit(): void {
//     if (this.registerForm.invalid) {
//       return;
//     }

//     this.isSubmitting = true;
//     this.errorMessage = '';

//     const { name, surname, email, password } = this.registerForm.value;

//     this.authService.register({ name, surname, email, password }).subscribe({
//       next: () => {
//         this.router.navigate(['/login'], {
//           queryParams: { registered: 'success' },
//         });
//       },
//       error: (error) => {
//         this.errorMessage = error.message || 'Registration failed. Please try again.';
//         this.isSubmitting = false;
//       },
//     });
//   }
// }

// /**
//  * Custom validator to check if password and confirm password match.
//  */
// function passwordMatchValidator(formGroup: FormGroup) {
//   const password = formGroup.get('password')?.value;
//   const confirmPassword = formGroup.get('confirmPassword')?.value;
//   return password === confirmPassword ? null : { passwordMismatch: true };
// }