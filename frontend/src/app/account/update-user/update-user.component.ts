import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type ValidationErrors,
} from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { Subject } from "rxjs"
import { takeUntil, catchError, finalize } from "rxjs/operators"
import { throwError } from "rxjs"
import { authAnimations } from "../../shared/animations/auth.animations"
import { HeaderComponent } from "../../layout/header/header.component"
import { AuthService } from "../../core/auth/auth.service"
import { UserService } from "../../core/services/user.service"
import type { User } from "../../core/models"
import { FooterComponent } from "../../layout/footer/footer.component";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
],
  animations: [authAnimations.fadeIn, authAnimations.slideUp, authAnimations.shake, authAnimations.scaleIn],
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  userForm: FormGroup
  currentUser: User | null = null
  hideCurrentPwd = true
  hideNewPwd = true
  hideConfirmPwd = true
  isLoading = false
  updateSuccess = false
  errorMessage: string | null = null
  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(2)]],
      cognome: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      currentPassword: [""],
      newPassword: [
        "",
        [Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)],
      ],
      confirmPassword: [""],
    })

    // Add password match validation when newPassword changes
    this.userForm.get("newPassword")?.valueChanges.subscribe(() => {
      this.userForm.get("confirmPassword")?.updateValueAndValidity()
    })

    this.userForm.get("confirmPassword")?.setValidators([this.passwordMatchValidator.bind(this)])
  }

  ngOnInit(): void {
    this.loadUserData()
  }

  private loadUserData(): void {
    this.authService
      .getIdentity()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user
          this.userForm.patchValue({
            nome: user.nome,
            cognome: user.cognome,
            email: user.email,
          })
        }
      })
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!control || !this.userForm) {
      return null
    }

    const newPassword = this.userForm.get("newPassword")?.value
    const confirmPassword = control.value

    // If both fields are empty, don't validate (password not being changed)
    if ((!newPassword || newPassword === "") && (!confirmPassword || confirmPassword === "")) {
      return null
    }

    // If new password is entered, confirmation is required
    if (newPassword && (!confirmPassword || confirmPassword === "")) {
      return { required: true }
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true }
    }

    // If password is being changed, current password is required
    const currentPassword = this.userForm.get("currentPassword")?.value
    if (newPassword && (!currentPassword || currentPassword === "")) {
      this.userForm.get("currentPassword")?.setErrors({ required: true })
    }

    return null
  }

  // Getters for field validation
  get nomeInvalid() {
    const control = this.userForm.get("nome")
    return control && control.invalid && (control.dirty || control.touched)
  }

  get cognomeInvalid() {
    const control = this.userForm.get("cognome")
    return control && control.invalid && (control.dirty || control.touched)
  }

  get emailInvalid() {
    const control = this.userForm.get("email")
    return control && control.invalid && (control.dirty || control.touched)
  }

  get currentPasswordInvalid() {
    const control = this.userForm.get("currentPassword")
    return control && control.invalid && (control.dirty || control.touched)
  }

  get newPasswordInvalid() {
    const control = this.userForm.get("newPassword")
    return control && control.invalid && (control.dirty || control.touched)
  }

  get confirmPasswordInvalid() {
    const control = this.userForm.get("confirmPassword")
    return control && control.invalid && (control.dirty || control.touched)
  }

  // Error message getters
  getNomeErrorMessage(): string {
    const control = this.userForm.get("nome")
    if (control?.hasError("required")) {
      return "Il nome è obbligatorio"
    }
    if (control?.hasError("minlength")) {
      return "Il nome deve contenere almeno 2 caratteri"
    }
    return ""
  }

  getCognomeErrorMessage(): string {
    const control = this.userForm.get("cognome")
    if (control?.hasError("required")) {
      return "Il cognome è obbligatorio"
    }
    if (control?.hasError("minlength")) {
      return "Il cognome deve contenere almeno 2 caratteri"
    }
    return ""
  }

  getEmailErrorMessage(): string {
    const control = this.userForm.get("email")
    if (control?.hasError("required")) {
      return "L'email è obbligatoria"
    }
    if (control?.hasError("email")) {
      return "Inserisci un indirizzo email valido"
    }
    return ""
  }

  getCurrentPasswordErrorMessage(): string {
    const control = this.userForm.get("currentPassword")
    if (control?.hasError("required")) {
      return "La password attuale è obbligatoria per modificare la password"
    }
    return ""
  }

  getNewPasswordErrorMessage(): string {
    const control = this.userForm.get("newPassword")
    if (control?.hasError("minlength")) {
      return "La password deve contenere almeno 6 caratteri"
    }
    if (control?.hasError("pattern")) {
      return "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero"
    }
    return ""
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.userForm.get("confirmPassword")
    if (control?.hasError("required")) {
      return "La conferma della password è obbligatoria"
    }
    if (control?.hasError("passwordMismatch")) {
      return "Le password non coincidono"
    }
    return ""
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isLoading = true
    this.updateSuccess = false
    this.errorMessage = null

    const formData = this.userForm.value
    const updateData: any = {
      nome: formData.nome,
      cognome: formData.cognome,
      email: formData.email,
    }

    // Add password only if it was entered
    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword
      updateData.newPassword = formData.newPassword
    }

    if (this.currentUser?.id) {
      this.userService
        .updateUser(this.currentUser.id as unknown as number, updateData)
        .pipe(
          catchError((error) => {
            console.error("Update error:", error)
            const message =
              error.response?.data?.message || "Errore durante l'aggiornamento del profilo. Riprova più tardi."
            this.snackBar.open(message, "Chiudi", {
              duration: 5000,
              horizontalPosition: "center",
              verticalPosition: "top",
              panelClass: ["error-snackbar"],
            })
            this.errorMessage = message
            return throwError(() => new Error(message))
          }),
          finalize(() => {
            this.isLoading = false
          }),
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: (updatedUser) => {
            this.updateSuccess = true

            // Update user identity in auth service
            this.authService.updateUserIdentity({
              ...this.currentUser,
              nome: formData.nome,
              cognome: formData.cognome,
              email: formData.email,
            })

            this.snackBar.open("Profilo aggiornato con successo!", "Chiudi", {
              duration: 5000,
              horizontalPosition: "center",
              verticalPosition: "top",
              panelClass: ["success-snackbar"],
            })

            // Reset password fields
            this.userForm.patchValue({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            })

            // Reset field states
            this.userForm.get("currentPassword")?.markAsUntouched()
            this.userForm.get("newPassword")?.markAsUntouched()
            this.userForm.get("confirmPassword")?.markAsUntouched()
          },
        })
    }
  }

  resetForm(): void {
    if (this.currentUser) {
      this.userForm.patchValue({
        nome: this.currentUser.nome,
        cognome: this.currentUser.cognome,
        email: this.currentUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      this.userForm.markAsPristine()
      this.userForm.markAsUntouched()
      this.updateSuccess = false
      this.errorMessage = null
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
