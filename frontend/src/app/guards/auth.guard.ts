// import { Injectable } from "@angular/core";
// import { CanActivate, Router, UrlTree } from "@angular/router";
// import { Observable } from "rxjs";
// import { AuthService } from "../service/auth.service";

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//     constructor(private authService: AuthService, private router: Router) { }

//     /**
//      * Prevents unauthorized access to protected routes
//      * Redirects to login page if user is not authenticated
//      */
//     canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//         if (this.authService.isAuthenticated()) {
//             return true;
//         }

//         // Redirect to login page if not authenticated
//         return this.router.createUrlTree(['/login']);
//     }
// }
