// src/app/components/shared/form-field/form-field.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() minLength: number | null = null;
  @Input() isRequired: boolean = false;
  @Input() isEmail: boolean = false;

  get control(): AbstractControl | null {
    return this.formGroup.get(this.controlName);
  }

  get isInvalid(): boolean {
    const control = this.control;
    return control !== null && control.invalid && control.touched;
  }

  hasError(errorName: string): boolean {
    const control = this.control;
    return control !== null && control.hasError(errorName) && control.touched;
  }
}
