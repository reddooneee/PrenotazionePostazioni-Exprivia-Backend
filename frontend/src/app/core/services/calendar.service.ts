import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isDisabled: boolean;
  availableCount?: number;
}

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private currentDate = new BehaviorSubject<Date>(new Date());
  private selectedDates = new BehaviorSubject<Date[]>([]);
  private calendarDays = new BehaviorSubject<CalendarDay[]>([]);

  constructor() {
    this.renderCalendar();
  }

  getCurrentDate(): Observable<Date> {
    return this.currentDate.asObservable();
  }

  getSelectedDates(): Observable<Date[]> {
    return this.selectedDates.asObservable();
  }

  getCalendarDays(): Observable<CalendarDay[]> {
    return this.calendarDays.asObservable();
  }

  setCurrentDate(date: Date): void {
    this.currentDate.next(date);
    this.renderCalendar();
  }

  selectDates(dates: Date[]): void {
    this.selectedDates.next(dates);
    this.renderCalendar();
  }

  getCurrentWeek(): Date[] {
    const curr = new Date(this.currentDate.value);
    const week: Date[] = [];

    // Starting from Monday
    curr.setDate(curr.getDate() - curr.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    return week;
  }

  private renderCalendar(): void {
    const days: CalendarDay[] = [];
    const currentDate = this.currentDate.value;
    const selectedDates = this.selectedDates.value;
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const today = new Date();

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      days.push(this.createCalendarDay(date, false, today, selectedDates));
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      days.push(this.createCalendarDay(date, true, today, selectedDates));
    }

    // Add days from next month if needed
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    if (remainingDays > 0) {
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(lastDay);
        date.setDate(date.getDate() + i);
        days.push(this.createCalendarDay(date, false, today, selectedDates));
      }
    }

    this.calendarDays.next(days);
  }

  private createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    selectedDates: Date[]
  ): CalendarDay {
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    const isWeekend = this.isWeekend(date);

    return {
      date,
      isCurrentMonth,
      isSelected,
      isToday,
      isWeekend,
      isDisabled: isWeekend || date < today,
    };
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  }

  nextMonth(): void {
    const current = this.currentDate.value;
    this.setCurrentDate(
      new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  }

  previousMonth(): void {
    const current = this.currentDate.value;
    this.setCurrentDate(
      new Date(current.getFullYear(), current.getMonth() - 1, 1)
    );
  }

  formatMonthYear(date: Date): string {
    return date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  }
}
