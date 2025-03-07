import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AxiosService } from './service/axios.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(private axiosService: AxiosService){}

  onLogin(input: any): void {
    this.axiosService.request(
      "POST",
      "/api/login",
      {
        login: input.login,
        password: input.password
      },
    )

  }
}
