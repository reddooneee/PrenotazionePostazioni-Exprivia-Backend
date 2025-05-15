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
  time: string;
  isAvailable: boolean;
}

export interface UserBooking {
  id: number;
  desk: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface DateAvailability {
  date: string;
  timeSlots?: TimeSlotBooking[];
  availableCount: number;
}

export interface AvailabilityStatus {
  level: 'alta' | 'media' | 'bassa' | 'nessuna';
  text: string;
  description: string;
  dotClass: string;
  availableCount?: number;
  totalCount?: number;
}

export interface BookingFormData {
  tipo_stanza: string;
  piano: string;
  id_postazione: string;
  ora_inizio: string;
  dipendenti: string[];
} 