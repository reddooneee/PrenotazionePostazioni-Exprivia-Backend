import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/models';

export interface DialogData {
  title: string;
  user: Partial<User>;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <!-- Modal Overlay -->
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 99999; display: flex; align-items: center; justify-content: center;"
         (click)="onCancel()">
      
      <div class="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-300 w-full max-w-lg mx-4" 
           (click)="$event.stopPropagation()">
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <!-- Header -->
          <div class="px-6 py-4 bg-blue-50 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              <i class="fas fa-user-plus text-blue-600 mr-2" *ngIf="!data.user.id_user"></i>
              <i class="fas fa-user-edit text-blue-600 mr-2" *ngIf="data.user.id_user"></i>
              {{ data.title }}
            </h3>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4 max-h-96 overflow-y-auto">
            <div class="space-y-4">
              
              <!-- Nome -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" 
                       formControlName="nome" 
                       placeholder="Inserisci il nome"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <div *ngIf="userForm.get('nome')?.invalid && userForm.get('nome')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  Il nome è obbligatorio
                </div>
              </div>

              <!-- Cognome -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
                <input type="text" 
                       formControlName="cognome" 
                       placeholder="Inserisci il cognome"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <div *ngIf="userForm.get('cognome')?.invalid && userForm.get('cognome')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  Il cognome è obbligatorio
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" 
                       formControlName="email" 
                       placeholder="Inserisci l'email"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  <span *ngIf="userForm.get('email')?.errors?.['required']">L'email è obbligatoria</span>
                  <span *ngIf="userForm.get('email')?.errors?.['email']">Inserisci un indirizzo email valido</span>
                </div>
              </div>

              <!-- Password (solo per nuovi utenti) -->
              <div *ngIf="!data.user.id_user">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" 
                       formControlName="password" 
                       placeholder="Inserisci la password"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <div *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  <span *ngIf="userForm.get('password')?.errors?.['required']">La password è obbligatoria</span>
                  <span *ngIf="userForm.get('password')?.errors?.['minlength']">La password deve essere di almeno 6 caratteri</span>
                </div>
              </div>

              <!-- Ruolo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
                <select formControlName="authorities" 
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Seleziona ruolo</option>
                  <option value="ROLE_USER">Dipendente</option>
                  <option value="ROLE_ADMIN">Amministratore</option>
                </select>
                <div *ngIf="userForm.get('authorities')?.invalid && userForm.get('authorities')?.touched" 
                     class="text-sm text-red-600 mt-1">
                  Il ruolo è obbligatorio
                </div>
              </div>

            </div>

            <!-- Error message -->
            <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" 
                    (click)="onCancel()"
                    [disabled]="isLoading"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              Annulla
            </button>
            <button type="submit" 
                    [disabled]="isLoading || userForm.invalid"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              {{ isLoading ? (data.user.id_user ? 'Salvataggio...' : 'Creazione...') : (data.user.id_user ? 'Salva' : 'Crea') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserFormDialogComponent implements OnInit {
  @Input() data: DialogData = { title: '', user: {} };
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  userForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      authorities: ['ROLE_USER', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.user) {
      this.userForm.patchValue({
        nome: this.data.user.nome || '',
        cognome: this.data.user.cognome || '',
        email: this.data.user.email || '',
        authorities: this.data.user.authorities?.[0] || 'ROLE_USER'
      });

      // Set password validation based on whether it's a new user or edit
      const passwordControl = this.userForm.get('password');
      if (!this.data.user.id_user) {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        passwordControl?.clearValidators();
      }
      passwordControl?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const userData = this.userForm.value;
      
      // Convert authorities string to array
      if (userData.authorities) {
        userData.authorities = [userData.authorities];
      }
      
      // Remove password if empty (edit mode)
      if (!userData.password) {
        delete userData.password;
      }

      // Mark all fields as touched to show validation errors if any
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });

      this.submitted.emit(userData);
    } else {
      this.errorMessage = 'Compila tutti i campi richiesti';
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
} 