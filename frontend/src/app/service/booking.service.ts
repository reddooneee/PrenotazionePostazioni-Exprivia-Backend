import { Injectable } from "@angular/core";
import { AxiosService } from "./axios.service";

export interface Booking {
  id_prenotazioni?: number;
  data: string;
  ora_inizio: string;
  ora_fine: string;
  stato: "CONFERMATA" | "IN_ATTESA" | "ANNULLATA" | "RIFIUTATA";
  user_id: number;
  desk_id: number;
}

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private readonly endpoint = "/api/prenotazioni";

  constructor(private axiosService: AxiosService) {}

  // Ottieni tutte le prenotazioni
  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookings = await this.axiosService.get<Booking[]>(this.endpoint);
      return bookings;
    } catch (error) {
      console.error("Errore durante il recupero delle prenotazioni:", error);
      throw error;
    }
  }

  // Ottieni una prenotazione per ID
  async getBookingById(id: number): Promise<Booking> {
    try {
      const booking = await this.axiosService.get<Booking>(
        `${this.endpoint}/${id}`
      );
      return booking;
    } catch (error) {
      console.error("Errore durante il recupero della prenotazione:", error);
      throw error;
    }
  }

  // Crea una nuova prenotazione
  async createBooking(booking: Booking): Promise<Booking> {
    try {
      const newBooking = await this.axiosService.post<Booking>(
        `${this.endpoint}/creaPrenotazione`,
        booking
      );
      return newBooking;
    } catch (error) {
      console.error("Errore durante la creazione della prenotazione:", error);
      throw error;
    }
  }

  // Aggiorna una prenotazione
  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    try {
      const updatedBooking = await this.axiosService.put<Booking>(
        `${this.endpoint}/aggiornaPrenotazione/${id}`,
        updates
      );
      return updatedBooking;
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento della prenotazione:",
        error
      );
      throw error;
    }
  }

  // Elimina una prenotazione
  async deleteBooking(id: number): Promise<void> {
    try {
      await this.axiosService.delete(
        `${this.endpoint}/eliminaPrenotazione/${id}`
      );
    } catch (error) {
      console.error("Errore durante l'eliminazione della prenotazione:", error);
      throw error;
    }
  }

  // Ottieni le prenotazioni di oggi
//   async getTodayBookings(): Promise<Booking[]> {
//     try {
//       const today = new Date().toISOString().split("T")[0];
//       const bookings = await this.axiosService.get<Booking[]>(
//         `${this.endpoint}/today`
//       );
//       return bookings;
//     } catch (error) {
//       console.error(
//         "Errore durante il recupero delle prenotazioni odierne:",
//         error
//       );
//       throw error;
//     }
  }

  // Ottieni le prenotazioni di un utente
//   async getUserBookings(userId: number): Promise<Booking[]> {
//     try {
//       const bookings = await this.axiosService.get<Booking[]>(
//         `${this.endpoint}/user/${userId}`
//       );
//       return bookings;
//     } catch (error) {
//       console.error(
//         "Errore durante il recupero delle prenotazioni dell'utente:",
//         error
//       );
//       throw error;
//     }
//   }

