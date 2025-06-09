import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PrenotazioneService } from '@core/services/prenotazione.service';
import { AuthService } from '@core/auth/auth.service';
import { AdminService } from '@core/services/admin.service';
import { Prenotazione } from '@core/models/prenotazione.model';

interface StatsData {
  totalBookings: number;
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  mostPopularRoom: string;
  mostPopularTimeSlot: string;
  avgBookingDuration: number;
  totalUsers: number;
  usersWithBookings: number;
  roomUtilization: { roomName: string; percentage: number }[];
  timeSlotDistribution: { timeSlot: string; count: number }[];
  weeklyTrend: { day: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  stats: StatsData = {
    totalBookings: 0,
    todayBookings: 0,
    weekBookings: 0,
    monthBookings: 0,
    mostPopularRoom: '',
    mostPopularTimeSlot: '',
    avgBookingDuration: 0,
    totalUsers: 0,
    usersWithBookings: 0,
    roomUtilization: [],
    timeSlotDistribution: [],
    weeklyTrend: [],
    monthlyTrend: []
  };

  isLoading = true;
  isRefreshing = false;
  isAdmin = false;

  constructor(
    private prenotazioneService: PrenotazioneService,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkUserRole(): void {
    this.authService.getIdentity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isAdmin = user?.authorities?.includes('ROLE_ADMIN') || false;
      });
  }

  private loadStats(isRefresh: boolean = false): void {
    if (isRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    
    // Fetch both bookings and users data (admin-only page)
    forkJoin({
      prenotazioni: this.prenotazioneService.getPrenotazioni(),
      users: this.adminService.getAllUsers()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ prenotazioni, users }) => {
        this.calculateStats(prenotazioni, users.length);
        if (isRefresh) {
          this.isRefreshing = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        if (isRefresh) {
          this.isRefreshing = false;
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  private calculateStats(prenotazioni: Prenotazione[], totalUsersCount: number): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Parse dates properly
    const parsedPrenotazioni = prenotazioni.map(p => ({
      ...p,
      data_inizio: this.parseDate(p.data_inizio),
      data_fine: this.parseDate(p.data_fine)
    }));

    // Basic counts
    this.stats.totalBookings = parsedPrenotazioni.length;
    this.stats.todayBookings = parsedPrenotazioni.filter(p => 
      p.data_inizio >= today && p.data_inizio < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    ).length;
    this.stats.weekBookings = parsedPrenotazioni.filter(p => p.data_inizio >= weekAgo).length;
    this.stats.monthBookings = parsedPrenotazioni.filter(p => p.data_inizio >= monthAgo).length;

    // Users with bookings count
    const uniqueUsers = new Set(parsedPrenotazioni.map(p => p.users?.id_user));
    this.stats.usersWithBookings = uniqueUsers.size;
    
    // Total users count
    this.stats.totalUsers = totalUsersCount;

    // Most popular room
    const roomCounts = new Map<string, number>();
    parsedPrenotazioni.forEach(p => {
      const roomName = p.stanze?.nome || 'N/A';
      roomCounts.set(roomName, (roomCounts.get(roomName) || 0) + 1);
    });
    this.stats.mostPopularRoom = this.getMostPopular(roomCounts);

    // Most popular time slot
    const timeSlotCounts = new Map<string, number>();
    parsedPrenotazioni.forEach(p => {
      const timeSlot = this.getTimeSlot(p.data_inizio);
      timeSlotCounts.set(timeSlot, (timeSlotCounts.get(timeSlot) || 0) + 1);
    });
    this.stats.mostPopularTimeSlot = this.getMostPopular(timeSlotCounts);

    // Average booking duration (in hours)
    const totalDuration = parsedPrenotazioni.reduce((sum, p) => {
      const duration = (p.data_fine.getTime() - p.data_inizio.getTime()) / (1000 * 60 * 60);
      return sum + duration;
    }, 0);
    this.stats.avgBookingDuration = totalDuration / parsedPrenotazioni.length || 0;

    // Room utilization (top 5)
    this.stats.roomUtilization = Array.from(roomCounts.entries())
      .map(([room, count]) => ({
        roomName: room,
        percentage: Math.round((count / this.stats.totalBookings) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Time slot distribution
    this.stats.timeSlotDistribution = Array.from(timeSlotCounts.entries())
      .map(([timeSlot, count]) => ({ timeSlot, count }))
      .sort((a, b) => b.count - a.count);

    // Weekly trend (last 7 days)
    this.stats.weeklyTrend = this.calculateWeeklyTrend(parsedPrenotazioni);

    // Monthly trend (last 6 months)
    this.stats.monthlyTrend = this.calculateMonthlyTrend(parsedPrenotazioni);
  }

  private parseDate(dateValue: any): Date {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    if (Array.isArray(dateValue)) {
      const [year, month, day, hours, minutes] = dateValue;
      return new Date(year, month - 1, day, hours, minutes);
    }
    
    if (typeof dateValue === 'string') {
      if (dateValue.includes(',')) {
        const [year, month, day, hours, minutes] = dateValue.split(',').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
      }
      return new Date(dateValue);
    }
    
    return new Date();
  }

  private getTimeSlot(date: Date): string {
    const hour = date.getHours();
    return `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
  }

  private getMostPopular(counts: Map<string, number>): string {
    if (counts.size === 0) return 'N/A';
    
    let maxCount = 0;
    let mostPopular = '';
    
    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count;
        mostPopular = item;
      }
    });
    
    return mostPopular;
  }

  private calculateWeeklyTrend(prenotazioni: Prenotazione[]): { day: string; count: number }[] {
    const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const trend = days.map(day => ({ day, count: 0 }));
    
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const count = prenotazioni.filter(p => 
        p.data_inizio >= dayStart && p.data_inizio < dayEnd
      ).length;
      
      trend[dayIndex].count = count;
    }
    
    return trend;
  }

  private calculateMonthlyTrend(prenotazioni: Prenotazione[]): { month: string; count: number }[] {
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const trend = [];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      
      const count = prenotazioni.filter(p => 
        p.data_inizio >= monthStart && p.data_inizio < monthEnd
      ).length;
      
      trend.push({
        month: months[date.getMonth()],
        count
      });
    }
    
    return trend;
  }

  refreshStats(): void {
    this.loadStats(true);
  }

  // Helper methods for template calculations
  getWeeklyTrendHeight(count: number): number {
    if (this.stats.weeklyTrend.length === 0) return 0;
    const maxCount = Math.max(...this.stats.weeklyTrend.map(d => d.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  getMonthlyTrendHeight(count: number): number {
    if (this.stats.monthlyTrend.length === 0) return 0;
    const maxCount = Math.max(...this.stats.monthlyTrend.map(m => m.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  getTodayPercentage(): number {
    return this.stats.totalBookings > 0 ? (this.stats.todayBookings / this.stats.totalBookings) * 100 : 0;
  }
} 