import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private currentDate = new Date();
  private displayDate = new BehaviorSubject<Date>(this.currentDate);

  constructor() {
    this.generateCalendarDays();
  }

  get calendarDays(): CalendarDay[] {
    return this.generateCalendarDays();
  }

  get formattedCurrentMonth(): string {
    const options = { month: 'long', year: 'numeric' } as const;
    return this.currentDate.toLocaleDateString('it-IT', options);
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.displayDate.next(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.displayDate.next(this.currentDate);
  }

  private generateCalendarDays(): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();

    // Primo giorno del mese corrente
    const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    
    // Ultimo giorno del mese precedente
    const lastDayOfPrevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);

    // Giorno della settimana del primo giorno del mese (0 = Domenica, 1 = Lunedì, ...)
    let firstWeekday = firstDayOfMonth.getDay();
    firstWeekday = firstWeekday === 0 ? 7 : firstWeekday; // Convertiamo Domenica da 0 a 7

    // Aggiungi i giorni del mese precedente
    for (let i = firstWeekday - 1; i > 0; i--) {
      const date = new Date(lastDayOfPrevMonth.getTime());
      date.setDate(lastDayOfPrevMonth.getDate() - i + 1);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }

    // Aggiungi i giorni del mese corrente
    const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }

    // Aggiungi i giorni del mese successivo
    const remainingDays = 42 - days.length; // 6 righe x 7 giorni = 42 celle totali
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }

    return days;
  }
} 