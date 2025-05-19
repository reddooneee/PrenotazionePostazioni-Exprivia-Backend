import { inject, Injectable } from "@angular/core";
import {
    mergeMap,
    Observable,
    tap,
    finalize,
    catchError,
    throwError,
    from,
    EMPTY,
} from "rxjs";
import { AuthJwtService } from "@core/auth/auth-jwt.service";
import { AuthService } from "@core/auth/auth.service";
import { User } from "@core/models";
import { Login } from "./login.model";
import { Router } from "@angular/router";
import { AxiosService } from "@core/services/axios.service";
import { NavigationService } from "@core/services/navigation.service";

@Injectable({ providedIn: "root" })
export class LoginService {
    private authService = inject(AuthService);
    private authJwtService = inject(AuthJwtService);
    private router = inject(Router);
    private axiosService = inject(AxiosService);
    private navigationService = inject(NavigationService);

    login(credentials: Login): Observable<User | null> {
        return from(this.axiosService.post<User>("/auth/login", credentials)).pipe(
            mergeMap((user) => {
                if (!user) {
                    return EMPTY;
                }
                return this.authJwtService.login(credentials).pipe(
                    mergeMap(() => this.authService.identity(true)),
                    tap((authenticatedUser) => {
                        if (authenticatedUser) {
                            this.authService.authenticate(authenticatedUser);
                        }
                    })
                );
            }),
            catchError((error) => {
                const errorDetails = {
                    timestamp: new Date().toISOString(),
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    message: error.response?.data?.message || error.message,
                    url: error.config?.url,
                    method: error.config?.method,
                    requestData: {
                        email: credentials.email,
                    },
                    responseData: error.response?.data,
                };

                console.error("Login error details:", errorDetails);

                let errorMessage: string;
                switch (error.response?.status) {
                    case 400:
                        errorMessage = "Email o password non corretti. Riprova.";
                        break;
                    case 401:
                        errorMessage = "Sessione scaduta. Effettua nuovamente il login.";
                        break;
                    case 403:
                        errorMessage =
                            "Accesso non autorizzato. Contatta l'amministratore.";
                        break;
                    case 404:
                        errorMessage = "Servizio non disponibile. Riprova più tardi.";
                        break;
                    case 0:
                        errorMessage =
                            "Impossibile connettersi al server. Verifica la tua connessione.";
                        break;
                    case 504:
                        errorMessage = "Timeout della connessione. Riprova più tardi.";
                        break;
                    default:
                        errorMessage =
                            "Si è verificato un errore durante il login. Riprova più tardi.";
                }

                return throwError(() => ({
                    message: errorMessage,
                    originalError: error,
                }));
            }),
            finalize(() => {
                if (!this.authService.isAuthenticated()) {
                    this.authService.authenticate(null);
                }
            })
        );
    }

    logout(): void {
        console.log('LoginService: Starting logout process...');
        this.authJwtService.logout().pipe(
            tap(() => {
                console.log('LoginService: AuthJwtService logout completed');
                // Reset authentication state
                this.authService.authenticate(null);
                // Reset navigation items
                this.navigationService.resetNavigationItems();
            }),
            catchError((error) => {
                console.error("LoginService: Logout error:", {
                    timestamp: new Date().toISOString(),
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
                // Even if there's an error, we still want to clear the auth state
                this.authService.authenticate(null);
                this.navigationService.resetNavigationItems();
                return throwError(() => error);
            }),
            finalize(() => {
                console.log('LoginService: Logout process completed, navigating to login page...');
                // Navigate to login page after everything is done
                this.router.navigate(['/accedi']).then(() => {
                    console.log('LoginService: Navigation completed, reloading page...');
                    // Force reload the page to clear any cached state
                    window.location.reload();
                }).catch(error => {
                    console.error('LoginService: Navigation error:', error);
                    // If navigation fails, still try to reload
                    window.location.reload();
                });
            })
        ).subscribe({
            error: (error) => {
                console.error('LoginService: Logout subscription error:', error);
                // Ensure we still navigate to login even if there's an error
                this.router.navigate(['/accedi']).then(() => {
                    window.location.reload();
                });
            }
        });
    }
}
