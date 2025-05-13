import { Injectable } from "@angular/core";
import {
  DateAvailability,
  AvailabilityStatus,
} from "../interfaces/booking.interface";

@Injectable({
  providedIn: "root",
})
export class AvailabilityService {
  private dateAvailabilities: DateAvailability[] = [];
  private readonly totalWorkspaces = 34;
  private readonly totalMeetingRooms = 3;

  updateRandomAvailabilities(): void {
    this.dateAvailabilities = [];
    const today = new Date();

    // Generate availabilities for the next 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (this.isWeekend(date)) continue;

      const day = date.getDay();
      let availableCount = this.calculateAvailableCount(day);

      this.dateAvailabilities.push({
        date: date.toDateString(),
        availableCount,
      });
    }
  }

  private calculateAvailableCount(day: number): number {
    if (day === 2 || day === 4) {
      // Tuesday and Thursday: less availability (20-40%)
      return Math.floor(this.totalWorkspaces * (0.2 + Math.random() * 0.2));
    } else {
      // Other days: more availability (40-80%)
      return Math.floor(this.totalWorkspaces * (0.4 + Math.random() * 0.4));
    }
  }

  getAvailabilityForDate(date: Date): number {
    // If weekend, return 0
    if (this.isWeekend(date)) return 0;

    // Find stored availability
    const dateString = date.toDateString();
    const storedAvailability = this.dateAvailabilities.find(
      (a) => a.date === dateString
    );

    if (storedAvailability) {
      return storedAvailability.availableCount;
    }

    // If no stored availability, generate new one
    const day = date.getDay();
    const availableCount = this.calculateAvailableCount(day);

    // Store the availability
    this.dateAvailabilities.push({
      date: dateString,
      availableCount,
    });

    return availableCount;
  }

  calculateAvailabilityStatus(dates: Date[]): AvailabilityStatus {
    if (dates.length === 0) {
      return {
        level: "none",
        text: "Nessuna data selezionata",
        description: "",
        dotClass: "none",
      };
    }

    let totalAvailable = 0;
    let totalCount = 0;

    for (const date of dates) {
      const availableCount = this.getAvailabilityForDate(date);
      totalAvailable += availableCount;
      totalCount += this.totalWorkspaces;
    }

    const avgAvailabilityPercentage = (totalAvailable / totalCount) * 100;

    if (avgAvailabilityPercentage > 70) {
      return {
        level: "alta",
        text: "Alta disponibilità",
        description: `In media ${Math.floor(
          totalAvailable / dates.length
        )} postazioni disponibili per giorno`,
        dotClass: "available",
        availableCount: totalAvailable,
        totalCount: totalCount,
      };
    } else if (avgAvailabilityPercentage > 30) {
      return {
        level: "media",
        text: "Media disponibilità",
        description: `In media ${Math.floor(
          totalAvailable / dates.length
        )} postazioni disponibili per giorno`,
        dotClass: "medium",
        availableCount: totalAvailable,
        totalCount: totalCount,
      };
    } else {
      return {
        level: "bassa",
        text: "Bassa disponibilità",
        description: `In media solo ${Math.floor(
          totalAvailable / dates.length
        )} postazioni disponibili per giorno`,
        dotClass: "occupied",
        availableCount: totalAvailable,
        totalCount: totalCount,
      };
    }
  }

  getAvailabilityClass(availableCount: number): string {
    const availabilityPercentage =
      (availableCount / this.totalWorkspaces) * 100;

    if (availabilityPercentage > 70) return "high-availability";
    else if (availabilityPercentage > 30) return "medium-availability";
    else return "low-availability";
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }
}
