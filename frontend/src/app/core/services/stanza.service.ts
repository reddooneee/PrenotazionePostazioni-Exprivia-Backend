import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AxiosService } from "./axios.service";
import { Stanza } from "../models";
import { TokenService } from "../auth/token.service";

@Injectable({
    providedIn: "root",
})
export class StanzaService {
    private baseUrl = "/api/stanze";

    constructor(
        private axiosService: AxiosService,
        private tokenService: TokenService
    ) { }

    getAllStanze(): Observable<Stanza[]> {
        // Debug log to check token
        console.log("Current token:", this.tokenService.getToken());
        return from(this.axiosService.get<Stanza[]>(this.baseUrl)).pipe(
            tap({
                next: (response) => console.log("Stanze response:", response),
                error: (error) => console.error("Error fetching stanze:", error),
            })
        );
    }

    getStanze(): Observable<Stanza[]> {
        return this.getAllStanze();
    }

    getStanzaById(id: number): Observable<Stanza> {
        return from(this.axiosService.get<Stanza>(`${this.baseUrl}/${id}`));
    }

    createStanza(stanza: Partial<Stanza>): Observable<Stanza> {
        return from(
            this.axiosService.post<Stanza>(`${this.baseUrl}/creaStanza`, stanza)
        );
    }

    updateStanza(id: number, updates: Partial<Stanza>): Observable<Stanza> {
        return from(
            this.axiosService.put<Stanza>(
                `${this.baseUrl}/aggiornastanza/${id}`,
                updates
            )
        );
    }

    deleteStanza(id: number): Observable<void> {
        return from(
            this.axiosService.delete(`${this.baseUrl}/eliminastanza/${id}`)
        ).pipe(map(() => void 0));
    }
}
