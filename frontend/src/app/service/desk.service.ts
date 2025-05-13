import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service";
import { Desk } from "../config/desk.model";

@Injectable({
  providedIn: "root",
})
export class DeskService {
  private readonly endpoint = "/api/postazioni";

  constructor(private axiosService: AxiosService) {}

  // Ottieni tutte le postazioni
  async getDesks(): Promise<Desk[]> {
    try {
      const desks = await this.axiosService.get<Desk[]>(this.endpoint);
      return desks;
    } catch (error) {
      console.error("Errore durante il recupero delle postazioni:", error);
      throw error;
    }
  }

  // Ottieni una postazione per ID
  async getDeskById(id: number): Promise<Desk> {
    try {
      const desk = await this.axiosService.get<Desk>(`${this.endpoint}/${id}`);
      return desk;
    } catch (error) {
      console.error("Errore durante il recupero della postazione:", error);
      throw error;
    }
  }

  // Crea una nuova postazione
  async createDesk(desk: Desk): Promise<Desk> {
    try {
      const newDesk = await this.axiosService.post<Desk>(
        `${this.endpoint}/creaPostazione`,
        desk
      );
      return newDesk;
    } catch (error) {
      console.error("Errore durante la creazione della postazione:", error);
      throw error;
    }
  }

  // Aggiorna una postazione
  async updateDesk(id: number, updates: Partial<Desk>): Promise<Desk> {
    try {
      const updatedDesk = await this.axiosService.put<Desk>(
        `${this.endpoint}/aggiornaPostazione/${id}`,
        updates
      );
      return updatedDesk;
    } catch (error) {
      console.error("Errore durante l'aggiornamento della postazione:", error);
      throw error;
    }
  }

  // Elimina una postazione
  async deleteDesk(id: number): Promise<void> {
    try {
      await this.axiosService.delete(
        `${this.endpoint}/eliminaPostazione/${id}`
      );
    } catch (error) {
      console.error("Errore durante l'eliminazione della postazione:", error);
      throw error;
    }
  }
}
