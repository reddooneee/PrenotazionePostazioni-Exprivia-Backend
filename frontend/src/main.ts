import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { importProvidersFrom } from "@angular/core";
import { AppComponent } from "./app/app.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatNativeDateModule } from "@angular/material/core";
import { LucideAngularModule, Calendar, MapPin, Clock, Search } from "lucide-angular";

import { LoginComponent } from "./app/components/login/login.component";
import { DashboardComponent } from "./app/components/dashboard/dashboard.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: "", component: LoginComponent },
      { path: "dashboard", component: DashboardComponent },
      // { path: "prenota", component: BookingInterfaceComponent },
      // { path: "le-mie-prenotazioni", component: MyBookingsComponent },
    ]),
    provideAnimations(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatCardModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatTabsModule,
      MatNativeDateModule,
      LucideAngularModule.pick({ Calendar, MapPin, Clock, Search })
    ),
  ],
}).catch((err) => console.error(err));
