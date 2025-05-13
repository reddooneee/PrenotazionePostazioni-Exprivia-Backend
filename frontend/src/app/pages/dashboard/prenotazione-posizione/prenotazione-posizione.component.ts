import { Component, type OnInit, ChangeDetectorRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { BookingService, Booking } from "../../../services/booking.service"
import { AuthService } from "../../../core/auth/auth.service"
import { User } from "../../../core/auth/user.model"
import { WorkspaceService } from '../../../services/workspace.service'
import { AvailabilityService } from '../../../services/availability.service'
import { 
  BookingDetail, 
  TimeSlotBooking, 
  UserBooking, 
  DateAvailability, 
  AvailabilityStatus 
} from '../../../interfaces/booking.interface'
import {
  WorkspaceOption,
  FloorPlanMarker,
  PostazioneSelezionataEvent,
  WorkspaceData
} from '../../../interfaces/workspace.interface'

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isDisabled: boolean;
  availableCount?: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: "app-prenotazione-posizione",
  templateUrl: "./prenotazione-posizione.component.html",
  styleUrls: ["./prenotazione-posizione.component.css"]
})
export class PrenotazionePosizioneComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  selectedDates: Date[] = [];
  calendarDays: CalendarDay[] = [];
  currentDate = new Date();
  currentMonth = '';
  currentWeekDays: Date[] = [];
  availabilityStatus: AvailabilityStatus = {
    level: 'none',
    text: 'Nessuna data selezionata',
    description: '',
    dotClass: 'none'
  };
  
  bookingDetails: BookingDetail = {
    selectedType: '',
    selectedFloor: '',
    selectedWorkspace: '',
    selectedTime: '',
    dipendenti: []
  };

  workspaceOptions: WorkspaceOption[] = [];
  floorPlanMarkers: FloorPlanMarker[] = [];
  userBookings: UserBooking[] = [];
  timeSlots: TimeSlotBooking[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private bookingService: BookingService,
    private authService: AuthService,
    private workspaceService: WorkspaceService,
    private availabilityService: AvailabilityService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.currentUser = await this.authService.getUser();
      await this.loadUserBookings();
      this.availabilityService.updateRandomAvailabilities();
      this.renderCalendar();
      this.updateCurrentWeek();
    } catch (error) {
      console.error('Error initializing component:', error);
    }
  }

  async loadUserBookings(): Promise<void> {
    if (!this.currentUser?.id_user) return;

    try {
      this.isLoading = true;
      this.userBookings = await this.bookingService.getUserBookings(this.currentUser.id_user);
    } catch (error) {
      console.error('Error loading user bookings:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onDateSelection(dates: Date[]): void {
    this.selectedDates = dates;
    this.availabilityStatus = this.availabilityService.calculateAvailabilityStatus(dates);
    this.updateWorkspaceOptions();
  }

  updateWorkspaceOptions(): void {
    if (this.bookingDetails.selectedFloor && this.bookingDetails.selectedType) {
      this.workspaceOptions = this.workspaceService.getWorkspacesForFloor(
        this.bookingDetails.selectedFloor,
        this.bookingDetails.selectedType
      );
      this.updateFloorPlanMarkers();
    }
  }

  updateFloorPlanMarkers(): void {
    const availableWorkspaces = this.workspaceOptions
      .filter(w => w.status === 'available')
      .map(w => w.name);

    this.floorPlanMarkers = this.workspaceService.getFloorPlanMarkers(
      this.bookingDetails.selectedFloor,
      availableWorkspaces
    );
  }

  onPostazioneSelezionata(event: PostazioneSelezionataEvent): void {
    const workspace = this.workspaceOptions.find(w => 
      w.name.includes(event.stanza) && w.name.includes(event.postazione)
    );
    
    if (workspace) {
      this.bookingDetails.selectedWorkspace = workspace.id;
      this.updateTimeSlots();
    }
  }

  async updateTimeSlots(): Promise<void> {
    if (!this.selectedDates.length || !this.bookingDetails.selectedWorkspace) return;

    try {
      this.isLoading = true;
      this.timeSlots = await this.bookingService.getTimeSlots(
        this.selectedDates[0],
        this.bookingDetails.selectedWorkspace
      );
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async createBooking(): Promise<void> {
    if (!this.currentUser?.id_user || !this.validateBookingDetails()) return;

    try {
      this.isLoading = true;
      const booking: Booking = {
        data: this.selectedDates[0].toISOString().split('T')[0],
        ora_inizio: this.bookingDetails.selectedTime,
        ora_fine: this.calculateEndTime(this.bookingDetails.selectedTime, this.bookingDetails.selectedType),
        stato: 'CONFERMATA',
        user_id: this.currentUser.id_user,
        desk_id: parseInt(this.bookingDetails.selectedWorkspace),
        dipendenti: this.bookingDetails.dipendenti
      };

      await this.bookingService.createBooking(booking);
      await this.loadUserBookings();
      this.resetForm();
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateEndTime(startTime: string, bookingType: string): string {
    if (bookingType.includes('Giornata intera')) {
      return '18:00';
    }
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 4;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private validateBookingDetails(): boolean {
    return !!(
      this.selectedDates.length &&
      this.bookingDetails.selectedType &&
      this.bookingDetails.selectedFloor &&
      this.bookingDetails.selectedWorkspace &&
      this.bookingDetails.selectedTime
    );
  }

  private resetForm(): void {
    this.selectedDates = [];
    this.bookingDetails = {
      selectedType: '',
      selectedFloor: '',
      selectedWorkspace: '',
      selectedTime: '',
      dipendenti: []
    };
    this.workspaceOptions = [];
    this.floorPlanMarkers = [];
    this.timeSlots = [];
  }

  private renderCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const today = new Date();

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isWeekend: this.isWeekend(date),
        isDisabled: true
      });
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = this.isDateSelected(date);
      const isWeekend = this.isWeekend(date);
      const availableCount = this.availabilityService.getAvailabilityForDate(date);

      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isSelected,
        isToday,
        isWeekend,
        isDisabled: isWeekend,
        availableCount
      });
    }

    // Add days from next month
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isWeekend: this.isWeekend(date),
        isDisabled: true
      });
    }
  }

  private updateCurrentWeek(): void {
    this.currentWeekDays = [];
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      this.currentWeekDays.push(currentDay);
    }
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  private isDateSelected(date: Date): boolean {
    return this.selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  }
}
