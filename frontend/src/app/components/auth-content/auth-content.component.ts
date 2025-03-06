import { Component } from '@angular/core';
import { AxiosService } from '../../service/axios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-content',
  imports: [CommonModule],
  templateUrl: './auth-content.component.html',
  styleUrls: ['./auth-content.component.css'],
})


export class AuthContentComponent {
  data: string[] = [];

  constructor(private axiosService: AxiosService) {}

  ngOnInit(): void {
    this.axiosService.request(
      'GET',
      '/messages',
      null
    ).then(
      (response) => {
        if (Array.isArray(response.data)) {
          this.data = response.data;
        } else {
          console.error("I dati ricevuti non sono un array:", response.data);
        }
      }
    ).catch(
      (error) => {
        console.error("Error while fetching data", error);
      }
    );
  }
}