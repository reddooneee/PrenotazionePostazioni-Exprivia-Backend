export interface BookingDetail {
  selectedType: string;
  selectedFloor: string;
  selectedWorkspace: string;
  selectedTime: string;
  dipendenti: string[];
}

export interface TimeSlotBooking {
  date: Date;
  hour: string;
  booking: string | null;
}

export interface UserBooking {
  id: number;
  date: Date;
  location: string;
  floor: string;
  workspace: string;
  type: string;
  time: string;
  isForOthers?: boolean;
  bookedByOthers?: boolean;
  employees?: string[];
}

export interface DateAvailability {
  date: string;
  availableCount: number;
}

export interface AvailabilityStatus {
  level: string;
  text: string;
  description: string;
  dotClass: string;
  availableCount?: number;
  totalCount?: number;
} 