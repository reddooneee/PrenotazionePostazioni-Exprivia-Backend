import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {

  @Output() onSubmitLoginEvent: EventEmitter<{ login: string, password: string }> = new EventEmitter();

  login: string = '';
  password: string = '';

  onSubmitLogin(): void {
    this.onSubmitLoginEvent.emit({ login: this.login, password: this.password });
  }
}