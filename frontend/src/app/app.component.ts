import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router"
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { filter } from "rxjs";



@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  showLayout: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Aggiungi il controllo per la rotta 'prenotazione-posizione'
      this.showLayout = !event.urlAfterRedirects.includes('/admin-dashboard') &&
                        !event.urlAfterRedirects.includes('/prenotazione-posizione');
    });
  }
}

