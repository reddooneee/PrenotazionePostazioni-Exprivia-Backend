import { Injectable, signal, computed, Signal } from "@angular/core";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  endOfWeek, 
  getDay, 
  startOfDay,
  isWeekend,
  addDays
} from "date-fns";
import { it } from "date-fns/locale";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isDisabled: boolean;
  isSelected?: boolean;
  availableCount?: number | undefined;
}

export type CalendarView = 'month' | 'week';

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private readonly currentDateTime = signal<Date>(new Date());
  private readonly selectedDates = signal<Date[]>([]);
  private readonly currentView = signal<CalendarView>("month");

  readonly calendarDays = computed(() => {
    const current = this.currentDateTime();
    const view = this.currentView();

    if (view === "month") {
      // Per la vista mensile, genera sempre una griglia 5x7
      const firstDayOfMonth = startOfMonth(current);
      const startDate = startOfWeek(firstDayOfMonth, { locale: it, weekStartsOn: 1 });
      
      // Genera 35 giorni (5 settimane)
      const days: CalendarDay[] = [];
      for (let i = 0; i < 35; i++) {
        const date = addDays(startDate, i);
        const isWeekendDay = isWeekend(date);
        days.push({
          date,
          isCurrentMonth: isSameMonth(date, current),
          isToday: isToday(date),
          isWeekend: isWeekendDay,
          isDisabled: this.isDateDisabled(date, isWeekendDay)
        });
      }
      return days;
    } else {
      // Per la vista settimanale
      const start = startOfWeek(current, { locale: it, weekStartsOn: 1 });
      const end = endOfWeek(current, { locale: it, weekStartsOn: 1 });
      
      return eachDayOfInterval({ start, end }).map(date => {
        const isWeekendDay = isWeekend(date);
        return {
          date,
          isCurrentMonth: isSameMonth(date, current),
          isToday: isToday(date),
          isWeekend: isWeekendDay,
          isDisabled: this.isDateDisabled(date, isWeekendDay)
        };
      });
    }
  });

  readonly formattedCurrentMonth = computed(() => 
    format(this.currentDateTime(), "MMMM yyyy", { locale: it })
  );

  getCurrentDateTime(): Signal<Date> {
    return this.currentDateTime.asReadonly();
  }

  getSelectedDates(): Signal<Date[]> {
    return this.selectedDates.asReadonly();
  }

  getCurrentView(): Signal<CalendarView> {
    return this.currentView.asReadonly();
  }

  setView(view: CalendarView): void {
    this.currentView.set(view);
  }

  setCurrentDate(date: Date): void {
    this.currentDateTime.set(startOfDay(date));
  }

  selectDates(dates: Date[]): void {
    this.selectedDates.set(dates.map(date => startOfDay(date)));
  }

  getCurrentWeek(): Date[] {
    const curr = this.currentDateTime();
    const start = startOfWeek(curr, { locale: it, weekStartsOn: 1 });
    return eachDayOfInterval({
      start,
      end: endOfWeek(curr, { locale: it, weekStartsOn: 1 })
    });
  }

  nextMonth(): void {
    this.currentDateTime.update(current => startOfDay(addMonths(current, 1)));
  }

  previousMonth(): void {
    this.currentDateTime.update(current => startOfDay(subMonths(current, 1)));
  }

  nextWeek(): void {
    this.currentDateTime.update(current => startOfDay(addWeeks(current, 1)));
  }

  previousWeek(): void {
    this.currentDateTime.update(current => startOfDay(subWeeks(current, 1)));
  }

  formatMonthYear(date: Date): string {
    return format(date, "MMMM yyyy", { locale: it });
  }

  private isDateDisabled(date: Date, isWeekendDay: boolean): boolean {
    const today = startOfDay(new Date());
    return date < today || isWeekendDay;
  }
}
