import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
  @Input() set selectedDates(dates: Date[]) {
    this._selectedDates = dates ? [...dates] : []; // Create new array reference
    this.updateDays();
    this.cdr.markForCheck(); // Ensure change detection runs
  }
  get selectedDates(): Date[] {
    return this._selectedDates;
  }
  @Input() disabledDates: Date[] = [];
  @Input() dateTooltips: Map<string, string> = new Map();
  @Output() dateSelectionChange = new EventEmitter<Date[]>();
  @Output() monthChange = new EventEmitter<Date>();

  currentDate = new Date();
  weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  private _days: CalendarDay[] = [];
  private _selectedDates: Date[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.updateDays();
  }

  get currentMonth(): number {
    return this.currentDate.getMonth();
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  getMonthName(): string {
    return this.currentDate.toLocaleString('it-IT', { month: 'long' });
  }

  isCurrentMonth(): boolean {
    const today = new Date();
    return this.currentDate.getMonth() === today.getMonth() && 
           this.currentDate.getFullYear() === today.getFullYear();
  }

  previousPeriod(): void {
    if (this.isCurrentMonth()) {
      return; // Don't allow going back from current month
    }
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateDays();
    this.monthChange.emit(this.currentDate);
  }

  nextPeriod(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateDays();
    this.monthChange.emit(this.currentDate);
  }

  getDays(): CalendarDay[] {
    return this._days;
  }

  private updateDays(): void {
    const days: CalendarDay[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Add days from previous month to fill first week
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7
    if (firstDayOfWeek > 1) {
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0);
      for (let i = firstDayOfWeek - 1; i > 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay.getDate() - i + 1);
        days.push(this.createCalendarDay(date, today));
      }
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      days.push(this.createCalendarDay(date, today));
    }

    // Add days from next month to fill last week
    const lastDayOfWeek = lastDay.getDay() || 7; // Convert Sunday (0) to 7
    if (lastDayOfWeek < 7) {
      for (let i = 1; i <= 7 - lastDayOfWeek; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push(this.createCalendarDay(date, today));
      }
    }

    this._days = days;
    this.cdr.markForCheck();
  }

  private createCalendarDay(date: Date, today: Date): CalendarDay {
    const isPastDate = date < today;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isDisabled = isPastDate || isWeekend;

    return {
      date,
      isToday: this.isSameDay(date, today),
      isWeekend,
      isSelected: this.isDateSelected(date),
      isDisabled
    };
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private isDateSelected(date: Date): boolean {
    return this._selectedDates.some(selectedDate => this.isSameDay(selectedDate, date));
  }

  onDateClick(day: CalendarDay): void {
    if (day.isDisabled || day.isWeekend) {
      return; // Don't allow selection of disabled dates or weekends
    }
    
    const newSelectedDates = this.isDateSelected(day.date)
      ? this._selectedDates.filter(date => !this.isSameDay(date, day.date))
      : [day.date];
    
    // Update internal state immediately
    this._selectedDates = [...newSelectedDates]; // Create new array reference
    this.updateDays();
    this.cdr.detectChanges(); // Force change detection
    
    // Emit the change
    this.dateSelectionChange.emit([...newSelectedDates]); // Emit new array reference
  }

  getDateTooltip(date: Date): string {
    const dateStr = date.toISOString().split('T')[0];
    return this.dateTooltips.get(dateStr) || '';
  }
}
