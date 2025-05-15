import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from 'rxjs';

// Material imports
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule, MatStepper } from "@angular/material/stepper";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
    PrenotazioneService,
    StanzaService,
    PostazioneService,
    UtilsService,
    AuthService
} from "@core/services";
import {
    Prenotazione,
    Stanza,
    Postazione,
    TipoStanza,
    StatoPrenotazione,
    User
} from "@core/models";

@Component({
    selector: "app-booking",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatStepperModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: "./booking.component.html",
})
export class BookingComponent implements OnInit {
    @ViewChild('stepper') stepper!: MatStepper;
    bookings: Prenotazione[] = [];
    rooms: Stanza[] = [];
    filteredRooms: Stanza[] = [];
    selectedRoom?: Stanza;
    workstations: Postazione[] = [];
    loading = false;
    error = '';
    isLoading = false;
    isSubmitting = false;
    selectedLocation: any = null;
    selectedDate: Date | null = null;
    bookingType = "";
    selectedDesk: Postazione | null = null;
    selectedDuration = 0;
    startTime = "";
    locations = [{ id: "1", name: "Sede Principale", type: "HQ" }];
    availableDesks: Postazione[] = [];
    currentUser: User | null = null;

    constructor(
        private prenotazioneService: PrenotazioneService,
        private stanzaService: StanzaService,
        private postazioneService: PostazioneService,
        private authService: AuthService,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        try {
            this.currentUser = await this.authService.getCurrentUser();
            // await this.loadBookings();
            // await this.loadRooms();
        } catch (error: any) {
            this.error = error.message || 'Error initializing component';
        }
    }

    private async loadBookings(): Promise<void> {
        try {
            this.loading = true;
            const bookingsResult = await firstValueFrom(
                this.prenotazioneService.getAllPrenotazioni()
            );
            this.bookings = bookingsResult || [];
        } catch (error: any) {
            this.error = error.message || 'Error loading bookings';
            this.bookings = [];
        } finally {
            this.loading = false;
        }
    }

    private async loadRooms(): Promise<void> {
        try {
            this.loading = true;
            const roomsResult = await firstValueFrom(
                this.stanzaService.getAllStanze()
            );
            this.rooms = roomsResult || [];
            this.filteredRooms = [...this.rooms];
        } catch (error: any) {
            this.error = error.message || 'Error loading rooms';
            this.rooms = [];
            this.filteredRooms = [];
        } finally {
            this.loading = false;
        }
    }

    async filterRoomsByType(type: string) {
        try {
            this.loading = true;
            if (type === 'all') {
                this.filteredRooms = [...this.rooms];
            } else {
                this.filteredRooms = this.rooms.filter(room => room.tipo_stanza === type as TipoStanza);
            }
        } catch (error: any) {
            this.error = error.message || 'Error filtering rooms';
            this.filteredRooms = [];
        } finally {
            this.loading = false;
        }
    }

    async onRoomSelect(room: Stanza): Promise<void> {
        try {
            this.loading = true;
            this.selectedRoom = room;
            const workstationsResult = await firstValueFrom(
                this.postazioneService.getPostazioniByStanza(room.id_stanza || 0)
            );
            this.workstations = workstationsResult || [];
        } catch (error: any) {
            this.error = error.message || 'Error loading workstations';
            this.workstations = [];
        } finally {
            this.loading = false;
        }
    }

    async cancelBooking(id: number): Promise<void> {
        try {
            this.isLoading = true;
            await firstValueFrom(this.prenotazioneService.deletePrenotazione(id));
            await this.loadBookings();
        } catch (error) {
            console.error("Error canceling booking:", error);
        } finally {
            this.isLoading = false;
        }
    }

    goBack(): void {
        this.router.navigate(["/dashboard"]);
    }

    async loadDesksAndContinue(): Promise<void> {
        try {
            this.isLoading = true;
            if (this.selectedRoom) {
                const postazioni = await firstValueFrom(
                    this.postazioneService.getPostazioniByStanza(this.selectedRoom.id_stanza as any)
                );
                this.availableDesks = postazioni || [];
            }
        } catch (error) {
            console.error("Error loading desks:", error);
        } finally {
            this.isLoading = false;
        }
    }

    selectDesk(desk: Postazione): void {
        this.selectedDesk = desk;
    }

    formatDuration(minutes: number): string {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0
                ? `${hours} ore e ${remainingMinutes} minuti`
                : `${hours} ${hours === 1 ? "ora" : "ore"}`;
        }
        return `${minutes} minuti`;
    }

    async submitBooking(): Promise<void> {
        if (
            !this.selectedDate ||
            !this.selectedDesk ||
            !this.startTime ||
            !this.currentUser
        )
            return;

        try {
            this.isSubmitting = true;
            const [hours, minutes] = this.startTime.split(":").map(Number);
            const startDate = new Date(this.selectedDate);
            startDate.setHours(hours, minutes);

            const endDate = new Date(startDate);
            endDate.setMinutes(endDate.getMinutes() + this.selectedDuration);

            const booking: Partial<Prenotazione> = {
                user: this.currentUser,
                postazione: this.selectedDesk,
                data_inizio: startDate.toISOString(),
                data_fine: endDate.toISOString(),
                stato_prenotazione: StatoPrenotazione.CONFERMATA
            };

            await firstValueFrom(this.prenotazioneService.createPrenotazione(booking));
            await this.loadBookings();
            this.router.navigate(["/dashboard/bookings"]);
        } catch (error) {
            console.error("Error submitting booking:", error);
        } finally {
            this.isSubmitting = false;
        }
    }

    async loadRoomsAndContinue(): Promise<void> {
        try {
            this.loading = true;
            await this.loadRooms();
            this.stepper.next();
        } catch (error: any) {
            this.error = error.message || 'Error loading rooms';
        } finally {
            this.loading = false;
        }
    }

    selectRoom(room: Stanza): void {
        this.selectedRoom = room;
        this.onRoomSelect(room);
    }
}
