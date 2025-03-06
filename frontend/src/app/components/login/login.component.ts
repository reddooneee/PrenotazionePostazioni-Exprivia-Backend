import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {

  @Output() onSubmitLoginEvent: EventEmitter<{ email: string, password: string }> = new EventEmitter();

  email: string = '';
  password: string = '';

  onSubmitLogin(): void {
    this.onSubmitLoginEvent.emit({ email: this.email, password: this.password });
  }
}