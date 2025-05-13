import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service";
import { User } from "../core/auth/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly endpoint = "/api/admin";

  constructor(private axiosService: AxiosService) {}

  // Ottieni tutti gli utenti
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.axiosService.get<User[]>(`${this.endpoint}/utenti`);
      return users;
    } catch (error) {
      console.error("Errore durante il recupero degli utenti:", error);
      throw new Error("Impossibile recuperare la lista degli utenti");
    }
  }

  // Ottieni un utente per ID
  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.axiosService.get<User>(`${this.endpoint}/utente/${id}`);
      return user;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente:", error);
      throw new Error(`Impossibile trovare l'utente con ID ${id}`);
    }
  }

  // Ottieni un utente per email
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.axiosService.get<User>(`${this.endpoint}/utente/email/${email}`);
      return user;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente:", error);
      throw new Error(`Impossibile trovare l'utente con email ${email}`);
    }
  }

  // Aggiorna un utente
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.axiosService.put<User>(`${this.endpoint}/utente/${id}`, updates);
      return updatedUser;
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'utente:", error);
      throw new Error("Impossibile aggiornare l'utente");
    }
  }

  // Elimina un utente
  async deleteUser(id: number): Promise<void> {
    try {
      await this.axiosService.delete(`${this.endpoint}/utente/${id}`);
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'utente:", error);
      throw new Error("Impossibile eliminare l'utente");
    }
  }

  // Registra un nuovo utente
  async registerUser(userData: Partial<User>): Promise<User> {
    try {
      const newUser = await this.axiosService.post<User>(`/api/auth/register`, userData);
      return newUser;
    } catch (error) {
      console.error("Errore durante la registrazione dell'utente:", error);
      throw new Error("Impossibile registrare il nuovo utente");
    }
  }
}
