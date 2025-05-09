import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
