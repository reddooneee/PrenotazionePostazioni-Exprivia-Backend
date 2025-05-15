import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent {
  isRouteActive(route: string): boolean {
    return window.location.pathname === route;
  }
}
