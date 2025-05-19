import { Injectable } from "@angular/core";
import { AuthService } from "@core/auth/auth.service";
import { Observable, from } from "rxjs";

export interface RegisterUserData {
  nome: string;
  cognome: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class RegisterService {

    constructor(private authService: AuthService) {}

    register(userData: RegisterUserData): Observable<any> {
        return from(this.authService.register(userData));
    }
}
