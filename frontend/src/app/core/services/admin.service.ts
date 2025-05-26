import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { AxiosService } from "./axios.service";
import { User } from "../models";

@Injectable({
    providedIn: "root",
})
export class AdminService {
    private readonly baseUrl = "/api/admin";

    constructor(private axiosService: AxiosService) { }

    getAllUsers(): Observable<User[]> {
        return from(this.axiosService.get<User[]>(`${this.baseUrl}/utenti`));
    }

    getUserById(id: number): Observable<User> {
        return from(this.axiosService.get<User>(`${this.baseUrl}/utente/${id}`));
    }

    getUserByEmail(email: string): Observable<User> {
        return from(this.axiosService.get<User>(`${this.baseUrl}/utente/email/${email}`));
    }

    createUser(user: Partial<User>): Observable<User> {
        return from(this.axiosService.post<User>(`${this.baseUrl}/crea_utente`, user));
    }

    updateUser(id: number, updates: Partial<User>): Observable<User> {
        return from(this.axiosService.put<User>(`${this.baseUrl}/utente/${id}`, updates));
    }

    deleteUser(id: number): Observable<void> {
        return from(this.axiosService.delete(`${this.baseUrl}/utente/${id}`)).pipe(
            map(() => void 0)
        );
    }

    createAdminUser(user: Partial<User>): Observable<User> {
        return from(this.axiosService.post<User>(`${this.baseUrl}/crea_utente`, user));
    }
}
