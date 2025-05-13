import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { UserBooking, TimeSlotBooking } from '../interfaces/booking.interface';

export interface Booking {
  id?: number;
  data: string;
  ora_inizio: string;
  ora_fine: string;
  stato: string;
  user_id: number;
  desk_id: number;
  dipendenti?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private axiosService: AxiosService) {}

  async getUserBookings(userId: number): Promise<UserBooking[]> {
    try {
      const response = await this.axiosService.get(`/api/prenotazioni/utente/${userId}`);
      return response.data.map((booking: any) => ({
        id: booking.id,
        date: new Date(booking.data),
        location: booking.location,
        floor: booking.floor,
        workspace: booking.workspace,
        type: booking.type,
        time: booking.ora_inizio,
        isForOthers: booking.dipendenti?.length > 0,
        bookedByOthers: booking.booked_by_others,
        employees: booking.dipendenti
      }));
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async getTimeSlots(date: Date, workspaceId: string): Promise<TimeSlotBooking[]> {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await this.axiosService.get(`/api/prenotazioni/timeslots/${workspaceId}/${formattedDate}`);
      return response.data.map((slot: any) => ({
        date: new Date(slot.data),
        hour: slot.ora,
        booking: slot.prenotazione
      }));
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  }

  async createBooking(booking: Booking): Promise<void> {
    try {
      await this.axiosService.post('/api/prenotazioni/creaPrenotazione', booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: number): Promise<void> {
    try {
      await this.axiosService.delete(`/api/prenotazioni/eliminaPrenotazione/${bookingId}`);
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  }

  async updateBooking(bookingId: number, updates: Partial<Booking>): Promise<void> {
    try {
      await this.axiosService.put(`/api/prenotazioni/aggiornaPrenotazione/${bookingId}`, updates);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }
} 