import { Routes } from "@angular/router";
import { BookingComponent } from "./booking.component";
import { UserRouteAccessService } from "@core/auth/user-route-access.service";

export const BOOKING_ROUTES: Routes = [
  {
    path: "",
    component: BookingComponent,
    data: { authorities: ["ROLE_USER", "ROLE_ADMIN"] },
    canActivate: [UserRouteAccessService],
  },
];
