import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { importProvidersFrom, LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import { AppComponent } from "./app/app.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { MatNativeDateModule } from "@angular/material/core";
import { CalendarService } from "./app/core/services/calendar.service";
import {
  LucideAngularModule,
  CircleCheck,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  User,
  LogOut,
  Mail,
  Eye,
  EyeOff,
  Lock,
  Menu,
  Home,
  Users,
  Folder,
  Plus,
  Edit,
  Trash,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Shield,
  ChartBar,
  LayoutDashboard,
  X
} from "lucide-angular";
import { routes } from "./app/app.routes";
import { provideHttpClient } from "@angular/common/http";
import { AxiosService } from "./app/core/services/axios.service";
import { UserService } from "./app/core/services/user.service";
import { AuthService } from "./app/core/auth/auth.service";
import { MessageService } from "primeng/api";

// Importa la configurazione delle rotte

// Register Italian locale
registerLocaleData(localeIt);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Usa la configurazione delle rotte
    provideAnimations(),
    provideHttpClient(),
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
      MatSidenavModule,
      MatExpansionModule,
      LucideAngularModule.pick({
        ChevronDown,
        CircleCheck,
        Calendar,
        MapPin,
        Clock,
        Search,
        ArrowRight,
        User,
        LogOut,
        Mail,
        Eye,
        EyeOff,
        Lock,
        Menu,
        Home,
        Users,
        Folder,
        Plus,
        Edit,
        Trash,
        PanelLeftClose,
        PanelLeftOpen,
        Bell,
        Shield,
        ChartBar,
        LayoutDashboard,
        X
      })
    ),
    AxiosService,
    UserService,
    AuthService,
    CalendarService,
    MessageService,
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ],
}).catch((err) => console.error(err));
