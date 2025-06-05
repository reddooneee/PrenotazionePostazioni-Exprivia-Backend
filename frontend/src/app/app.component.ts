import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router"
import { FooterComponent } from "./layout/footer/footer.component";
import { filter } from "rxjs";
import { UpdateUserComponent } from "./account/update-user/update-user.component";
import { HeaderComponent } from "./layout/header/header.component";
import { AuthService } from "./core/auth/auth.service";


@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = 'exprivia';
  showLayout: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Mostra header e footer sempre, tranne che per:
      // - Dashboard admin (gli admin hanno la loro sidebar)
      // - Pagine di login/registrazione se necessario
      const isAdminDashboard = event.urlAfterRedirects.includes('/dashboard') && 
        this.authService.hasAnyAuthority(['ROLE_ADMIN']);
      
      this.showLayout = !isAdminDashboard;
    });
  }
}

