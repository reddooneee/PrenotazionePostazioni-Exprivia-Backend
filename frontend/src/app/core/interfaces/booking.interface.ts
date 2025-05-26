import { Postazione, User } from '@core/models';

export interface BookingDetail {
  id?: number;
  user: User;
  postazione: Postazione;
  data_inizio: string;
  data_fine: string;
  stato_prenotazione: string;
}

export interface TimeSlotBooking {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface UserBooking {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  postazione: string;
  stato: string;
}

export interface DateAvailability {
  date: Date;
  availableSlots: number;
  totalSlots: number;
}

export interface AvailabilityStatus {
  level: 'nessuna' | 'bassa' | 'media' | 'alta';
  text: string;
  description: string;
  dotClass: string;
}

export interface BookingFormData {
  tipo_stanza: string;
  piano: string;
  id_postazione: string;
  ora_inizio: string;
  dipendenti: string[];
} 