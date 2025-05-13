import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service"; // Assicurati di importare correttamente AxiosService
import { User } from "../core/auth/user.model"; // Assicurati che il tuo modello utente sia correttamente importato

@Injectable({
  providedIn: "root",
})
export class UserService {
  private endpoint = "/api/admin/utenti";

  constructor(private axiosService: AxiosService) {}

  // Ottieni tutti gli utenti
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.axiosService.get<User[]>(this.endpoint);
      return users;
    } catch (error) {
      console.error("Errore durante il recupero degli utenti:", error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  }

  // Ottieni un utente per ID
  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.axiosService.get<User>(
        `${this.endpoint}/utente/${id}`
      );
      return user;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente per ID:", error);
      throw error;
    }
  }

  // Ottieni un utente per email
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.axiosService.get<User>(
        `${this.endpoint}/utente/email/${email}`
      );
      return user;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente per email:", error);
      throw error;
    }
  }

  // Crea un nuovo utente
  async registerUser(user: User): Promise<User> {
    try {
      const newUser = await this.axiosService.post<User>(
        `${this.endpoint}/creaUtente`,
        user
      );
      return newUser;
    } catch (error) {
      console.error("Errore durante la registrazione dell'utente:", error);
      throw error;
    }
  }

  // Aggiorna un utente
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.axiosService.put<User>(
        `${this.endpoint}/utente/${id}`,
        updates
      );
      return updatedUser;
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'utente:", error);
      throw error;
    }
  }

  // Elimina un utente
  async deleteUser(id: number): Promise<void> {
    try {
      await this.axiosService.delete(`${this.endpoint}/utente/${id}`);
    } catch (error) {
      console.error("Errore durante la cancellazione dell'utente:", error);
      throw error;
    }
  }
}
