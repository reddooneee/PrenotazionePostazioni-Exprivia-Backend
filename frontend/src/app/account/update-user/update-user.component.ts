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
import { Subject } from "rxjs"
import { takeUntil, catchError, finalize, timeout } from "rxjs/operators"
import { throwError } from "rxjs"
import { authAnimations } from "../../shared/animations/auth.animations"
import { AuthService } from "../../core/auth/auth.service"
import { UserService } from "../../core/services/user.service"
import type { User } from "../../core/models"
import { FooterComponent } from "../../layout/footer/footer.component";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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

  // Password requirements tracking
  passwordRequirements = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
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
    this.userForm.get("newPassword")?.valueChanges.subscribe((password) => {
      this.checkPasswordRequirements(password || '')
      this.userForm.get("confirmPassword")?.updateValueAndValidity()
    })

    this.userForm.get("confirmPassword")?.setValidators([this.passwordMatchValidator.bind(this)])
  }

  ngOnInit(): void {
    // Initialize component state
    this.isLoading = false
    this.updateSuccess = false
    this.errorMessage = null
    
    this.loadUserData()
  }

  private loadUserData(): void {
    this.isLoading = true
    this.errorMessage = null
    
    // Use the one-time identity method instead of the continuous observable
    this.authService
      .identity(true) // Force fresh fetch
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.currentUser = user
            this.userForm.patchValue({
              nome: user.nome,
              cognome: user.cognome,
              email: user.email,
            })
            console.log('Utente caricato correttamente:', user.nome, user.cognome)
          } else {
            this.errorMessage = 'Errore nel caricamento dei dati utente'
            console.warn('Utente non trovato')
          }
        },
        error: (error) => {
          console.error('Errore nel caricamento dei dati utente:', error)
          this.errorMessage = 'Errore nel caricamento dei dati utente'
          this.isLoading = false // Backup safety
        }
      })
  }

  // Check password requirements in real-time
  private checkPasswordRequirements(password: string): void {
    this.passwordRequirements.minLength = password.length >= 6
    this.passwordRequirements.hasUppercase = /[A-Z]/.test(password)
    this.passwordRequirements.hasLowercase = /[a-z]/.test(password)
    this.passwordRequirements.hasNumber = /\d/.test(password)
  }

  // Get overall password strength
  get passwordStrength(): number {
    const requirements = Object.values(this.passwordRequirements)
    return requirements.filter(req => req).length
  }

  // Get password strength text
  get passwordStrengthText(): string {
    const strength = this.passwordStrength
    if (strength === 0) return ''
    if (strength === 1) return 'Molto debole'
    if (strength === 2) return 'Debole'
    if (strength === 3) return 'Buona'
    return 'Forte'
  }

  // Get password strength color
  get passwordStrengthColor(): string {
    const strength = this.passwordStrength
    if (strength === 0) return 'text-gray-400'
    if (strength === 1) return 'text-red-500'
    if (strength === 2) return 'text-orange-500'
    if (strength === 3) return 'text-yellow-500'
    return 'text-green-500'
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
      return "La password attuale è richiesta per modificare la password"
    }
    return ""
  }

  getNewPasswordErrorMessage(): string {
    const control = this.userForm.get("newPassword")
    if (control?.hasError("required")) {
      return "La nuova password è obbligatoria"
    }
    if (control?.hasError("minlength")) {
      return "La password deve contenere almeno 6 caratteri"
    }
    if (control?.hasError("pattern")) {
      return "La password deve contenere almeno una maiuscola, una minuscola e un numero"
    }
    return ""
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.userForm.get("confirmPassword")
    if (control?.hasError("required")) {
      return "Conferma la nuova password"
    }
    if (control?.hasError("passwordMismatch")) {
      return "Le password non corrispondono"
    }
    return ""
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.isLoading) {
      return
    }

    this.isLoading = true
    this.errorMessage = null
    this.updateSuccess = false

    const formValue = this.userForm.value
    const updateData: any = {
      nome: formValue.nome,
      cognome: formValue.cognome,
      email: formValue.email,
    }

    // Only include password fields if they are filled
    if (formValue.newPassword && formValue.currentPassword) {
      updateData.password = formValue.newPassword
      updateData.currentPassword = formValue.currentPassword
    }

    // Use current user ID for the update
    if (!this.currentUser?.id_user) {
      this.errorMessage = "Errore: dati utente non disponibili"
      this.isLoading = false
      return
    }

    console.log(updateData);

    this.userService
      .updateUser(this.currentUser.id_user, updateData)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error("Update error:", error)
          if (error.status === 400) {
            this.errorMessage = "Dati non validi. Controlla i campi inseriti."
          } else if (error.status === 401) {
            this.errorMessage = "Password attuale non corretta."
          } else if (error.status === 409) {
            this.errorMessage = "L'email inserita è già in uso."
          } else {
            this.errorMessage = "Errore durante l'aggiornamento del profilo. Riprova più tardi."
          }
          return throwError(() => error)
        }),
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe({
        next: (updatedUser: any) => {
          this.updateSuccess = true
          this.currentUser = updatedUser
          
          // Clear password fields after successful update
          this.userForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
          
          // Update the auth service with new user data
          this.authService.authenticate(updatedUser)
          
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.updateSuccess = false
          }, 5000)
        },
        error: () => {
          // Error already handled in catchError
        },
      })
  }

  // Force reset all states (for debugging)
  forceReset(): void {
    console.log('Force reset called - before:', { isLoading: this.isLoading, currentUser: !!this.currentUser })
    this.isLoading = false
    this.updateSuccess = false
    this.errorMessage = null
    console.log('Force reset called - after:', { isLoading: this.isLoading, currentUser: !!this.currentUser })
  }

  resetForm(): void {
    console.log('Reset form called - before:', { isLoading: this.isLoading, currentUser: !!this.currentUser })
    
    if (this.currentUser) {
      this.userForm.patchValue({
        nome: this.currentUser.nome,
        cognome: this.currentUser.cognome,
        email: this.currentUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
    
    // Reset password requirements
    this.passwordRequirements = {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false
    }
    
    // Reset component state
    this.errorMessage = null
    this.updateSuccess = false
    this.isLoading = false
    
    // Reset form validation state
    this.userForm.markAsUntouched()
    this.userForm.markAsPristine()
    
    // Reset specific field errors
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key)
      control?.setErrors(null)
    })
    
    console.log('Reset form called - after:', { isLoading: this.isLoading, currentUser: !!this.currentUser })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
