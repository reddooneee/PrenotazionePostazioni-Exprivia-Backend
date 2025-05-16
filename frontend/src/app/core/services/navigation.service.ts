import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

// Interfaccia per gli elementi di navigazione
export interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
  authorities?: string[];
  children?: NavItem[];
}

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  // Lista degli elementi di navigazione
  private readonly navigationItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: "home",
      route: "/dashboard",
      authorities: ["ROLE_ADMIN"],
    },
    {
      label: "Utenti",
      icon: "users",
      route: "/dashboard/user-management",
      adminOnly: true,
      authorities: ["ROLE_ADMIN"],
    },
    {
      label: "Prenotazioni",
      icon: "calendar",
      route: "/dashboard/bookings",
      authorities: ["ROLE_USER", "ROLE_ADMIN"],
    },
    {
      label: "Prenota Postazione",
      icon: "layout-dashboard",
      route: "/dashboard/prenotazione-posizione",
      authorities: ["ROLE_USER", "ROLE_ADMIN"],
    },
    {
      label: "Statistiche",
      icon: "ChartBar",
      route: "/dashboard/statistiche",
      authorities: ["ROLE_ADMIN"],
    },
  ];

  // Subject per gestire gli aggiornamenti della navigazione
  private navigationSubject = new BehaviorSubject<NavItem[]>(
    this.navigationItems
  );

  constructor(private router: Router) {}

  // Metodo per ottenere gli elementi di navigazione come Observable
  getNavigationItems(): Observable<NavItem[]> {
    return this.navigationSubject.asObservable();
  }

  // Metodo per verificare se una route è attiva
  isRouteActive(route: string): boolean {
    const currentRoute = this.router.url.replace(/\/$/, "");
    const checkRoute = route.replace(/\/$/, "");

    const routeMap: { [key: string]: (route: string) => boolean } = {
      "": () => currentRoute === "" || currentRoute === "/",
      "/dashboard": () => currentRoute.startsWith("/dashboard"),
      "/dashboard/user-management": () =>
        currentRoute === "/dashboard/user-management",
      "/dashboard/bookings": () => currentRoute === "/dashboard/bookings",
      "/dashboard/prenotazione-posizione": () =>
        currentRoute === "/dashboard/prenotazione-posizione",
      "/dashboard/management": () =>
        currentRoute.startsWith("/dashboard/management"),
    };

    return routeMap[checkRoute]
      ? routeMap[checkRoute](currentRoute)
      : currentRoute === checkRoute || currentRoute.startsWith(checkRoute);
  }

  // Metodo per filtrare gli elementi di navigazione in base alle autorizzazioni
  filterNavigationByAuthorities(userAuthorities: string[]): NavItem[] {
    return this.navigationItems
      .map((item) => this.filterNavItem(item, userAuthorities))
      .filter((item) => item !== null) as NavItem[];
  }

  private filterNavItem(
    item: NavItem,
    userAuthorities: string[]
  ): NavItem | null {
    // Verifica se l'utente ha le autorizzazioni necessarie
    const hasAuthority =
      !item.authorities ||
      item.authorities.some((auth) => userAuthorities.includes(auth));

    if (!hasAuthority) {
      return null;
    }

    // Copia l'elemento di navigazione
    const filteredItem: NavItem = { ...item };

    // Filtra i figli se presenti
    if (filteredItem.children) {
      filteredItem.children = filteredItem.children
        .map((child) => this.filterNavItem(child, userAuthorities))
        .filter((child) => child !== null) as NavItem[];

      // Se non ci sono figli dopo il filtraggio, restituisci null
      if (filteredItem.children.length === 0) {
        return null;
      }
    }

    return filteredItem;
  }

  // Metodo per aggiornare gli elementi di navigazione in base alle autorizzazioni
  updateNavigationItems(userAuthorities: string[]): void {
    const filteredItems = this.filterNavigationByAuthorities(userAuthorities);
    this.navigationSubject.next(filteredItems);
  }
}
