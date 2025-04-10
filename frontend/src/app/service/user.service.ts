import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service";
import { User } from "../core/auth/user.model";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private endpoint = "/Utenti";

    constructor(private axiosService: AxiosService) { }

    // Ottiene tutti gli utenti
    async getAllUsers(): Promise<User[]> {
        const response = await this.axiosService.get(this.endpoint);
        return response.data;
    }

    // Ottiene un singolo utente per ID
    async getUserById(id: number): Promise<User> {
        const response = await this.axiosService.get(`/utente/${id}`);
        return response.data;
    }

    // Crea un nuovo utente
    async registerUser(user: User): Promise<any> {
        // Cambiato da this.http.post a this.axiosService.post
        return this.axiosService.post(`${this.endpoint}/creaUtente`, user); // Esegui la POST al backend
    }

    // Aggiorna un utente
    async updateUser(id: number, updates: Partial<User>): Promise<any> {
        return this.axiosService.put(`/aggiornaUtente/${id}`, updates);
    }

    // Elimina un utente
    async deleteUser(id: number): Promise<any> {
        return this.axiosService.delete(`/eliminaUtente/${id}`);
    }
}
