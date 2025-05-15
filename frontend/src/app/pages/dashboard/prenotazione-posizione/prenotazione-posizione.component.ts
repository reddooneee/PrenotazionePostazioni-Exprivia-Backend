import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from 'rxjs';
import {
  PrenotazioneService,
  PostazioneService,
  StanzaService,
} from "@core/services";
import { AuthService } from "@core/auth/auth.service";
import { CalendarService, CalendarDay } from "@core/services/calendar.service";
import {
  User,
  Prenotazione,
  Postazione,
  Stanza,
  StatoPostazione,
  StatoPrenotazione,
} from "@core/models";
import { WorkspaceService } from "@core/services/workspace.service";
import { AvailabilityService } from "@core/services/availability.service";
import {
  BookingDetail,
  TimeSlotBooking,
  UserBooking,
  DateAvailability,
  AvailabilityStatus,
} from "@core/interfaces/booking.interface";
import {
  WorkspaceOption,
  FloorPlanMarker,
  PostazioneSelezionataEvent,
  WorkspaceData,
} from "@core/interfaces/workspace.interface";
import { Subscription } from "rxjs";

interface BookingForm {
  tipo_stanza: string;
  piano: string;
  id_postazione: string;
  ora_inizio: string;
  dipendenti: string[];
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: "app-prenotazione-posizione",
  templateUrl: "./prenotazione-posizione.component.html",
})
export class PrenotazionePosizioneComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading = false;
  selectedDates: Date[] = [];
  calendarDays: CalendarDay[] = [];
  currentDate = new Date();
  currentMonth = "";
  currentWeekDays: Date[] = [];
  availabilityStatus: AvailabilityStatus = {
    level: "nessuna",
    text: "Nessuna data selezionata",
    description: "",
    dotClass: "none",
  };

  bookingForm: BookingForm = {
    tipo_stanza: "",
    piano: "",
    id_postazione: "",
    ora_inizio: "",
    dipendenti: [],
  };

  workspaceOptions: WorkspaceOption[] = [];
  floorPlanMarkers: FloorPlanMarker[] = [];
  userBookings: UserBooking[] = [];
  timeSlots: TimeSlotBooking[] = [];

  stanze: Stanza[] = [];
  postazioni: Postazione[] = [];
  prenotazioni: Prenotazione[] = [];
  availableTimeSlots: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private prenotazioneService: PrenotazioneService,
    private authService: AuthService,
    private postazioneService: PostazioneService,
    private stanzaService: StanzaService,
    private calendarService: CalendarService,
    private workspaceService: WorkspaceService,
    private availabilityService: AvailabilityService
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private setupSubscriptions(): void {
    this.subscriptions.push(
      this.calendarService.getCalendarDays().subscribe((days) => {
        this.calendarDays = days;
      }),
      this.calendarService.getSelectedDates().subscribe((dates) => {
        this.selectedDates = dates;
        if (dates.length > 0) {
          this.updateAvailablePostazioni();
        }
      }),
      this.calendarService.getCurrentDate().subscribe((date) => {
        this.currentMonth = this.calendarService.formatMonthYear(date);
        this.currentWeekDays = this.calendarService.getCurrentWeek();
      })
    );
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      this.currentUser = await this.authService.getUser();
      if (this.currentUser?.id_user) {
        await this.loadUserPrenotazioni();
      }
      await this.loadStanze();
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadUserPrenotazioni(): Promise<void> {
    if (!this.currentUser?.id_user) return;

    try {
      const prenotazioni = await firstValueFrom(
        this.prenotazioneService.getPrenotazioniByUser(this.currentUser.id_user)
      );
      this.prenotazioni = prenotazioni;
    } catch (error) {
      console.error("Error loading user prenotazioni:", error);
      this.prenotazioni = [];
    }
  }

  private async loadStanze(): Promise<void> {
    try {
      const stanze = await firstValueFrom(this.stanzaService.getStanze());
      this.stanze = stanze;
    } catch (error) {
      console.error("Error loading stanze:", error);
      this.stanze = [];
    }
  }

  async onTipoStanzaChange(): Promise<void> {
    if (!this.bookingForm.tipo_stanza) return;

    try {
      const stanza = await firstValueFrom(
        this.stanzaService.getStanzaById(parseInt(this.bookingForm.tipo_stanza))
      );
      this.stanze = [stanza];
    } catch (error) {
      console.error("Error loading stanze by tipo:", error);
      this.stanze = [];
    }
  }

  async onPianoChange(): Promise<void> {
    await this.updateAvailablePostazioni();
  }

  private async updateAvailablePostazioni(): Promise<void> {
    if (!this.selectedDates.length || !this.bookingForm.piano) return;

    try {
      this.isLoading = true;
      const date = this.selectedDates[0].toISOString().split("T")[0];
      const postazioni = await firstValueFrom(this.postazioneService.getAllPostazioni());
      this.postazioni = postazioni;

      // Filter by piano if needed
      if (this.bookingForm.piano) {
        this.postazioni = this.postazioni.filter(
          (p) => p.stanza?.piano === parseInt(this.bookingForm.piano)
        );
      }
    } catch (error) {
      console.error("Error loading available postazioni:", error);
      this.postazioni = [];
    } finally {
      this.isLoading = false;
    }
  }

  async onPostazioneChange(): Promise<void> {
    if (!this.selectedDates.length || !this.bookingForm.id_postazione) return;

    try {
      this.isLoading = true;
      // For now, just use some default time slots
      this.availableTimeSlots = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ];
    } catch (error) {
      console.error("Error loading time slots:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async createPrenotazione(): Promise<void> {
    if (!this.currentUser?.id_user || !this.validateForm()) return;

    try {
      this.isLoading = true;
      const prenotazione: Prenotazione = {
        user: this.currentUser,
        postazione: {
          id_postazione: parseInt(this.bookingForm.id_postazione),
          stato_postazione: StatoPostazione.OCCUPATO,
        },
        stato_prenotazione: StatoPrenotazione.CONFERMATA,
        data_inizio: `${this.selectedDates[0].toISOString().split("T")[0]}T${
          this.bookingForm.ora_inizio
        }`,
        data_fine: this.calculateEndTime(this.bookingForm.ora_inizio),
      };

      await firstValueFrom(this.prenotazioneService.createPrenotazione(prenotazione));
      await this.loadUserPrenotazioni();
      this.resetForm();
    } catch (error) {
      console.error("Error creating prenotazione:", error);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + 4;
    return `${this.selectedDates[0].toISOString().split("T")[0]}T${endHours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  private validateForm(): boolean {
    return !!(
      this.selectedDates.length &&
      this.bookingForm.tipo_stanza &&
      this.bookingForm.piano &&
      this.bookingForm.id_postazione &&
      this.bookingForm.ora_inizio
    );
  }

  private resetForm(): void {
    this.bookingForm = {
      tipo_stanza: "",
      piano: "",
      id_postazione: "",
      ora_inizio: "",
      dipendenti: [],
    };
    this.calendarService.selectDates([]);
    this.postazioni = [];
    this.availableTimeSlots = [];
  }

  // Calendar navigation methods
  nextMonth(): void {
    this.calendarService.nextMonth();
  }

  previousMonth(): void {
    this.calendarService.previousMonth();
  }

  onDateClick(day: CalendarDay): void {
    if (day.isDisabled) return;
    this.calendarService.selectDates([day.date]);
  }
}
