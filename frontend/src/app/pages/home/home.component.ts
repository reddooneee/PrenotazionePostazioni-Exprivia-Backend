import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HeaderComponent } from '../../layout/header/header.component';
@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink, LucideAngularModule, HeaderComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
