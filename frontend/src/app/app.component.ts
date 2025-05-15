import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router"
import { FooterComponent } from "./layout/footer/footer.component";
import { filter } from "rxjs";
import { PrenotazionePosizioneComponent } from "./pages/dashboard/prenotazione-posizione/prenotazione-posizione.component";



@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, PrenotazionePosizioneComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = 'exprivia';
  showLayout: boolean = true;

  constructor(private router: Router) { }

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

