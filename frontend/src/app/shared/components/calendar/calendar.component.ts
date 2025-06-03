import { Component, EventEmitter, Input, OnInit, Output, computed, Signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CalendarService, CalendarDay } from "@core/services/calendar.service";
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);

export type CalendarView = "month" | "week";

@Component({
    selector: "app-calendar",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
    @Input() view: CalendarView = "month";
    @Input() multiSelect = true;
    @Input() maxSelections = 5;
    @Input() selectedDates: Date[] = [];
    @Output() dateSelectionChange = new EventEmitter<Date[]>();

    readonly displayDays: Signal<CalendarDay[]>;
    readonly currentMonth;

    constructor(private calendarService: CalendarService) {
        this.displayDays = this.calendarService.calendarDays;
        this.currentMonth = this.calendarService.formattedCurrentMonth;
    }

    ngOnInit(): void {
        this.calendarService.setView(this.view);
    }

    setView(view: CalendarView): void {
        this.view = view;
        this.calendarService.setView(view);
    }

    previousPeriod(): void {
        if (this.view === "month") {
            this.calendarService.previousMonth();
        } else {
            this.calendarService.previousWeek();
        }
    }

    nextPeriod(): void {
        if (this.view === "month") {
            this.calendarService.nextMonth();
        } else {
            this.calendarService.nextWeek();
        }
    }

    onDateClick(day: CalendarDay): void {
        if (day.isDisabled || day.isWeekend) return;

        if (this.multiSelect) {
            const index = this.selectedDates.findIndex(
                (d) =>
                    d.getDate() === day.date.getDate() &&
                    d.getMonth() === day.date.getMonth() &&
                    d.getFullYear() === day.date.getFullYear()
            );

            if (index === -1) {
                if (this.selectedDates.length < this.maxSelections) {
                    this.selectedDates.push(day.date);
                }
            } else {
                this.selectedDates.splice(index, 1);
            }
            this.dateSelectionChange.emit(this.selectedDates);
        } else {
            this.selectedDates = [day.date];
            this.dateSelectionChange.emit(this.selectedDates);
        }
    }

    isSelected(day: CalendarDay): boolean {
        return this.selectedDates.some(
            (d) =>
                d.getDate() === day.date.getDate() &&
                d.getMonth() === day.date.getMonth() &&
                d.getFullYear() === day.date.getFullYear()
        );
    }
}
