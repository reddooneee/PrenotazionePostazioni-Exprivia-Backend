import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, LucideAngularModule], // 🔥 Qui non serve .pick() di nuovo!
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  isLoggedIn = false;

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }
}
