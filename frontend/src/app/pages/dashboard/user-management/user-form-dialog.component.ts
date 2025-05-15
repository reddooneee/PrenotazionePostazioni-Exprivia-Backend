import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '@core/models';

interface DialogData {
  title: string;
  user: Partial<User>;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-6">{{ data.title }}</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <!-- Nome -->
          <mat-form-field class="w-full">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="nome" placeholder="Inserisci il nome" required>
            <mat-error *ngIf="userForm.get('nome')?.errors?.['required']">
              Il nome è obbligatorio
            </mat-error>
          </mat-form-field>

          <!-- Cognome -->
          <mat-form-field  class="w-full">
            <mat-label>Cognome</mat-label>
            <input matInput formControlName="cognome" placeholder="Inserisci il cognome" required>
            <mat-error *ngIf="userForm.get('cognome')?.errors?.['required']">
              Il cognome è obbligatorio
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Email -->
        <mat-form-field  class="w-full mb-4">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Inserisci l'email" required type="email">
          <mat-error *ngIf="userForm.get('email')?.errors?.['required']">
            L'email è obbligatoria
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.errors?.['email']">
            Inserisci un indirizzo email valido
          </mat-error>
        </mat-form-field>

        <!-- Password (solo per nuovi utenti) -->
        <mat-form-field *ngIf="!data.user.id_user" class="w-full mb-4">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" placeholder="Inserisci la password" required>
          <mat-error *ngIf="userForm.get('password')?.errors?.['required']">
            La password è obbligatoria
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.errors?.['minlength']">
            La password deve essere di almeno 6 caratteri
          </mat-error>
        </mat-form-field>

        <!-- Ruolo -->
        <mat-form-field class="w-full mb-6">
          <mat-label>Ruolo</mat-label>
          <mat-select formControlName="authorities" required>
            <mat-option [value]="['ROLE_USER']">Dipendente</mat-option>
            <mat-option [value]="['ROLE_ADMIN']">Amministratore</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('authorities')?.errors?.['required']">
            Il ruolo è obbligatorio
          </mat-error>
        </mat-form-field>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button mat-button type="button" (click)="onCancel()">
            Annulla
          </button>
          <button mat-flat-button color="primary" type="submit" [disabled]="!userForm.valid">
            {{ data.user.id_user ? 'Salva' : 'Crea' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class UserFormDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.userForm = this.fb.group({
      nome: [data.user.nome || '', Validators.required],
      cognome: [data.user.cognome || '', Validators.required],
      email: [data.user.email || '', [Validators.required, Validators.email]],
      password: ['', data.user.id_user ? [] : [Validators.required, Validators.minLength(6)]],
      authorities: [data.user.authorities || ['ROLE_USER'], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      // Remove password if empty (edit mode)
      if (!userData.password) {
        delete userData.password;
      }

      this.dialogRef.close(userData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 