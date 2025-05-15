import { Component, type OnInit, ChangeDetectorRef, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { PlanimetriaModaleComponent } from "../planimetria-modale/planimetria-modale.component";

// Aggiungi queste importazioni all'inizio del file

interface CalendarDay {
  day: number
  isOtherMonth: boolean
  isToday: boolean
  isSelected: boolean
  date: Date
  availabilityInfo?: boolean
  availabilityClass?: string
  availableCount?: number // Numero di postazioni disponibili per il giorno
}

interface WorkspaceOption {
  id: string
  name: string
  status: string
  selected: boolean
}

interface AvailabilityStatus {
  level: string
  text: string
  description: string
  dotClass: string
  availableCount?: number
  totalCount?: number
}

interface BookingDetail {
  selectedType: string
  selectedFloor: string
  selectedWorkspace: string
  selectedTime: string
  dipendenti: string[]
}

interface TimeSlotBooking {
  date: Date
  hour: string
  booking: string | null
}

interface DateAvailability {
  date: string // Data in formato stringa
  availableCount: number
}

interface WorkspaceData {
  id: string
  name: string
  floor: string
  type: string
}

// Modifico l'interfaccia UserBooking per includere i dipendenti
interface UserBooking {
  id: number
  date: Date
  location: string
  floor: string
  workspace: string
  type: string
  time: string
  isForOthers?: boolean // Flag per indicare se la prenotazione è per altri dipendenti
  bookedByOthers?: boolean // Flag per indicare se la prenotazione è stata fatta da altri per te
  employees?: string[] // Lista dei dipendenti per cui è stata fatta la prenotazione
}

// Add these new interfaces after the existing interfaces
interface FloorPlanMarker {
  id: string
  x: number
  y: number
  room: string
  workstation: string
  available: boolean
}

// Aggiungi PlanimetriaModaleComponent agli imports del componente
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, PlanimetriaModaleComponent],
  selector: "app-prenotazione-posizione",
  templateUrl: "./prenotazione-posizione.component.html",
  styleUrls: ["./prenotazione-posizione.component.css"],
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
    level: "",
    text: "",
    description: "",
    dotClass: "",
    availableCount: 0,
    totalCount: 0,
  }

  // Nuove proprietà per la vista multipla
  calendarView = "month" // 'month' o 'week'
  currentWeekDays: Date[] = []
  currentDateTab = 0
  bookingDetails: BookingDetail[] = []
  timeSlotBookings: TimeSlotBooking[] = []

  // Simulazione di disponibilità
  totalWorkspaces = 34 // Totale postazioni di lavoro
  totalMeetingRooms = 3 // Totale sale riunioni

  // Memorizza le disponibilità per data
  dateAvailabilities: DateAvailability[] = []

  // Postazioni preferite (array di ID)
  preferredWorkspaces: string[] = ["", ""]

  // Database di postazioni disponibili
  workspacesDatabase: WorkspaceData[] = [
    { id: "A10-56", name: "A10 - Postazione 56", floor: "Stanza A10", type: "Postazione - Giornata intera" },
    { id: "A10-57", name: "A10 - Postazione 57", floor: "Stanza A10", type: "Postazione - Giornata intera" },
    { id: "A10-58", name: "A10 - Postazione 58", floor: "Stanza A10", type: "Postazione - Giornata intera" },
    { id: "A16-3", name: "A16 - Postazione 3", floor: "Stanza A16", type: "Postazione - Giornata intera" },
    { id: "A16-4", name: "A16 - Postazione 4", floor: "Stanza A16", type: "Postazione - Giornata intera" },
    { id: "A16-5", name: "A16 - Postazione 5", floor: "Stanza A16", type: "Postazione - Giornata intera" },
    { id: "A22-20", name: "A22 - Postazione 20", floor: "Stanza A22", type: "Postazione - Giornata intera" },
    { id: "A22-21", name: "A22 - Postazione 21", floor: "Stanza A22", type: "Postazione - Giornata intera" },
    { id: "A22-22", name: "A22 - Postazione 22", floor: "Stanza A22", type: "Postazione - Giornata intera" },
    { id: "A22-23", name: "A22 - Postazione 23", floor: "Stanza A22", type: "Postazione - Giornata intera" },
    { id: "A6-43", name: "A6 - Postazione 43", floor: "Stanza A6", type: "Postazione - Giornata intera" },
    { id: "A6-44", name: "A6 - Postazione 44", floor: "Stanza A6", type: "Postazione - Giornata intera" },
    { id: "A6-45", name: "A6 - Postazione 45", floor: "Stanza A6", type: "Postazione - Giornata intera" },
    { id: "A3A-36", name: "A3.A - Postazione 36", floor: "Stanza A3.A", type: "Postazione - Giornata intera" },
    { id: "A26-24", name: "A26 - Postazione 24", floor: "Stanza A26", type: "Postazione - Giornata intera" },
    { id: "A26-25", name: "A26 - Postazione 25", floor: "Stanza A26", type: "Postazione - Giornata intera" },
    { id: "A26-26", name: "A26 - Postazione 26", floor: "Stanza A26", type: "Postazione - Giornata intera" },
    { id: "A26-27", name: "A26 - Postazione 27", floor: "Stanza A26", type: "Postazione - Giornata intera" },
    { id: "A26-28", name: "A26 - Postazione 28", floor: "Stanza A26", type: "Postazione - Giornata intera" },
    { id: "A26-29", name: "A26 - Postazione 29", floor: "Stanza A26", type: "Postazione - Giornata intera" },
    { id: "A31-66", name: "A31 - Postazione 66", floor: "Stanza A31", type: "Postazione - Giornata intera" },
    { id: "A31-67", name: "A31 - Postazione 67", floor: "Stanza A31", type: "Postazione - Giornata intera" },
    { id: "A31-68", name: "A31 - Postazione 68", floor: "Stanza A31", type: "Postazione - Giornata intera" },
    { id: "A8-49", name: "A8 - Postazione 49", floor: "Stanza A8", type: "Postazione - Giornata intera" },
    { id: "A8-50", name: "A8 - Postazione 50", floor: "Stanza A8", type: "Postazione - Giornata intera" },
    { id: "A8-51", name: "A8 - Postazione 51", floor: "Stanza A8", type: "Postazione - Giornata intera" },
    { id: "A20-11", name: "A20 - Postazione 11", floor: "Stanza A20", type: "Postazione - Giornata intera" },
    { id: "A20-12", name: "A20 - Postazione 12", floor: "Stanza A20", type: "Postazione - Giornata intera" },
    { id: "A20-13", name: "A20 - Postazione 13", floor: "Stanza A20", type: "Postazione - Giornata intera" },
    { id: "A20-14", name: "A20 - Postazione 14", floor: "Stanza A20", type: "Postazione - Giornata intera" },
    { id: "A9-52", name: "A9 - Postazione 52", floor: "Stanza A9", type: "Postazione - Giornata intera" },
    { id: "A9-53", name: "A9 - Postazione 53", floor: "Stanza A9", type: "Postazione - Giornata intera" },
    { id: "A9-54", name: "A9 - Postazione 54", floor: "Stanza A9", type: "Postazione - Giornata intera" },
    { id: "A9-55", name: "A9 - Postazione 55", floor: "Stanza A9", type: "Postazione - Giornata intera" },
    { id: "GASTONE", name: "Sala Gastone", floor: "Sala Riunioni Gastone (8 Postazioni)", type: "Sala Riunione" },
    { id: "KEPLERO", name: "Sala Keplero", floor: "Sala Riunioni Keplero (12 Postazioni)", type: "Sala Riunione" },
    { id: "LEONARDO", name: "Sala Leonardo", floor: "Sala Riunioni Leonardo (7 Postazioni)", type: "Sala Riunione" },
  ]

  // Aggiungo le proprietà alla classe
  isUserMenuOpen = false
  showAlertCancellation = false

  // Aggiungo questa proprietà alla classe
  userBookings: UserBooking[] = []

  // Add these new properties to the class
  showFloorPlanModal = false
  floorPlanZoom = 1
  panPosition = { x: 0, y: 0 }
  isPanning = false
  panStart = { x: 0, y: 0 }
  floorPlanMarkers: FloorPlanMarker[] = []
  selectedMarker: string | null = null

  // Aggiungi questa proprietà per controllare la visibilità della modale della planimetria
  mostraPlanimetriaModale = false;

  constructor(@Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateMonth()
    this.renderCalendar()
    this.updateTypeOptions()
    this.updateFloorOptions()
    this.updateWorkspaceOptions()
    this.updateCurrentWeek()
    this.loadUserBookings() // Carica le prenotazioni dell'utente

    // Preload the floor plan image
    const floorPlanImage = new Image()
    floorPlanImage.src = "/images/planimetria.jpeg"

    // Aggiorna le disponibilità ogni 30 secondi
    setInterval(() => {
      this.updateRandomAvailabilities()
      this.renderCalendar()
      this.updateWorkspaceOptions()
      this.calculateAvailability()
      this.cdr.detectChanges()
    }, 30000)
  }

  // Metodo per aprire/chiudere il menu utente
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen
    this.cdr.detectChanges()
  }

  // Metodo per chiudere il menu utente
  closeUserMenu(): void {
    this.isUserMenuOpen = false
    this.cdr.detectChanges()
  }

  // Modifico il metodo loadUserBookings per includere esempi di prenotazioni per altri dipendenti
  loadUserBookings(): void {
    // TODO: Backend - Implementare la chiamata API per ottenere le prenotazioni dell'utente
    // Per ora, inizializziamo con un array vuoto per mostrare solo le prenotazioni aggiunte dall'utente
    this.userBookings = []
  }

  // Metodo per disdire una prenotazione
  cancelBooking(bookingId: number): void {
    if (confirm("Sei sicuro di voler disdire questa prenotazione?")) {
      // TODO: Backend - Implementare la chiamata API per disdire la prenotazione
      // Rimuovi la prenotazione dall'array locale
      this.userBookings = this.userBookings.filter((booking) => booking.id !== bookingId)

      // Mostra l'alert di conferma
      this.showAlertCancellation = true
      setTimeout(() => {
        this.showAlertCancellation = false
        this.cdr.detectChanges()
      }, 3000)

      this.cdr.detectChanges()
    }
  }

  // Metodo per il logout
  logout(): void {
    // TODO: Backend - Implementare la chiamata API per il logout
    console.log("Logout effettuato")
    // Reindirizza alla pagina di login
    // window.location.href = '/login';
  }

  // Ottieni le postazioni disponibili per la selezione delle preferenze
  getAvailableWorkspaces(): WorkspaceData[] {
    if (!this.selectedLocation) return []
    return this.workspacesDatabase.filter(
      (workspace) => workspace.type === "Postazione - Giornata intera" && this.selectedLocation === "Roma (Bufalotta)",
    )
  }

  // Aggiorna la preferenza di postazione
  updatePreferredWorkspace(preferenceIndex: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const value = selectElement.value
    this.preferredWorkspaces[preferenceIndex] = value

    // TODO: Salva le preferenze nel backend per uso futuro
    // savePreferencesToBackend(this.preferredWorkspaces);

    this.cdr.detectChanges()
  }

  // Verifica se una postazione è preferita
  isPreferredWorkspace(workspaceId: string): boolean {
    return this.preferredWorkspaces.includes(workspaceId)
  }

  // Verifica se ci sono postazioni preferite
  hasPreferredWorkspaces(): boolean {
    return this.preferredWorkspaces.some((id) => id && id.trim() !== "")
  }

  // Ottieni il nome di una postazione dal suo ID
  getWorkspaceName(workspaceId: string): string {
    const workspace = this.workspacesDatabase.find((w) => w.id === workspaceId)
    return workspace ? workspace.name : "Postazione sconosciuta"
  }

  addDipendente(tabIndex: number, nome: string): void {
    if (nome.trim()) {
      this.bookingDetails[tabIndex].dipendenti.push(nome.trim())
      this.cdr.detectChanges()
    }
  }

  removeDipendente(tabIndex: number, index: number): void {
    this.bookingDetails[tabIndex].dipendenti.splice(index, 1)
    this.cdr.detectChanges()
  }

  // Applica la selezione rapida
  applyQuickSelection(tabIndex: number): void {
    // Ottieni le opzioni disponibili per il tipo, piano e postazione
    const typeOptions = this.getTypeOptions()
    const selectedType = typeOptions[0]

    // Seleziona automaticamente il primo piano disponibile
    const floorOptions = this.getFloorOptions(selectedType)
    const selectedFloor = floorOptions[0]

    // Aggiorna i dettagli della prenotazione
    this.bookingDetails[tabIndex].selectedType = selectedType
    this.bookingDetails[tabIndex].selectedFloor = selectedFloor
    this.bookingDetails[tabIndex].selectedTime = "08:00"

    // Aggiorna le opzioni di postazione
    this.updateFloorOptions()
    this.updateWorkspaceOptions()

    // Trova la prima postazione disponibile
    // Prima controlla se una delle postazioni preferite è disponibile
    let availableWorkspace = null

    // Controlla la prima preferenza
    if (this.preferredWorkspaces[0]) {
      const preferredId = this.preferredWorkspaces[0]
      const preferred = this.workspaceOptions.find((w) => w.id === preferredId && w.status === "available")
      if (preferred) {
        availableWorkspace = preferred
      }
    }

    // Se la prima preferenza non è disponibile, controlla la seconda
    if (!availableWorkspace && this.preferredWorkspaces[1]) {
      const preferredId = this.preferredWorkspaces[1]
      const preferred = this.workspaceOptions.find((w) => w.id === preferredId && w.status === "available")
      if (preferred) {
        availableWorkspace = preferred
      }
    }

    // Se nessuna preferenza è disponibile, prendi la prima postazione disponibile
    if (!availableWorkspace) {
      availableWorkspace = this.workspaceOptions.find((w) => w.status === "available")
    }

    if (availableWorkspace) {
      this.selectWorkspace(availableWorkspace, tabIndex)
    }

    this.cdr.detectChanges()
  }

  // Ottieni le opzioni di tipo
  getTypeOptions(): string[] {
    if (this.selectedLocation === "Roma (Bufalotta)") {
      return [
        "Postazione - Giornata intera",
        "Sala Riunione - Giornata Intera",
        "Sala Riunione - 30 min",
        "Sala Riunione - 60 min",
        "Sala Riunione - 120 min",
        "Sala Riunione - 4 ore",
      ]
    } else {
      return ["Nessuna opzione disponibile"]
    }
  }

  // Ottieni le opzioni di piano in base al tipo selezionato
  getFloorOptions(selectedType: string): string[] {
    if (this.selectedLocation === "Roma (Bufalotta)" && selectedType === "Postazione - Giornata intera") {
      return [
        "Stanza A10",
        "Stanza A16",
        "Stanza A22",
        "Stanza A6",
        "Stanza A3.A",
        "Stanza A26",
        "Stanza A31",
        "Stanza A8",
        "Stanza A20",
        "Stanza A9",
      ]
    } else if (this.selectedLocation === "Roma (Bufalotta)" && selectedType.includes("Sala Riunione")) {
      return [
        "Sala Riunioni Gastone (8 Postazioni)",
        "Sala Riunioni Keplero (12 Postazioni)",
        "Sala Riunioni Leonardo (7 Postazioni)",
      ]
    } else {
      return ["Nessuna opzione disponibile"]
    }
  }

  // Aggiorna casualmente le disponibilità
  updateRandomAvailabilities(): void {
    // Aggiorna le disponibilità per le date
    this.dateAvailabilities = []

    // Genera disponibilità per i prossimi 60 giorni
    const today = new Date()
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Salta i weekend
      if (this.isWeekend(date)) continue

      // Genera una disponibilità casuale
      const day = date.getDay()
      let availableCount = 0

      if (this.selectedLocation === "Roma (Bufalotta)") {
        if (day === 2 || day === 4) {
          // Martedì e giovedì: meno disponibilità (20-40%)
          availableCount = Math.floor(this.totalWorkspaces * (0.2 + Math.random() * 0.2))
        } else {
          // Altri giorni: più disponibilità (40-80%)
          availableCount = Math.floor(this.totalWorkspaces * (0.4 + Math.random() * 0.4))
        }
      } else {
        if (day === 2 || day === 4) {
          // Martedì e giovedì: meno disponibilità (20-40%)
          availableCount = Math.floor(this.totalWorkspaces * (0.2 + Math.random() * 0.2))
        } else {
          // Altri giorni: più disponibilità (40-80%)
          availableCount = Math.floor(this.totalWorkspaces * (0.4 + Math.random() * 0.4))
        }
      }

      this.dateAvailabilities.push({
        date: date.toDateString(),
        availableCount,
      })
    }
  }

  // Aggiorna il mese corrente
  updateMonth(): void {
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ]
    this.currentMonth = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
  }

  // Renderizza il calendario
  renderCalendar(): void {
    // Se non ci sono disponibilità, generane di nuove
    if (this.dateAvailabilities.length === 0) {
      this.updateRandomAvailabilities()
    }

    this.calendarDays = []
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
    const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0)

    // Giorni del mese precedente
    for (let i = firstDay.getDay(); i > 0; i--) {
      const day = prevMonthLastDay.getDate() - i + 1
      this.calendarDays.push({
        day,
        isOtherMonth: true,
        isToday: false,
        isSelected: false,
        date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, day),
        availabilityInfo: false,
      })
    }

    // Giorni del mese corrente
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = this.isDateSelected(date)

      // Ottieni la disponibilità per il giorno corrente
      const availableCount = this.calculateAvailableCount(date)
      const availabilityClass = this.getAvailabilityClass(availableCount)

      this.calendarDays.push({
        day,
        isOtherMonth: false,
        isToday,
        isSelected,
        date,
        availabilityInfo: true,
        availabilityClass,
        availableCount,
      })
    }

    // Giorni del mese successivo
    const remainingDays = 42 - (firstDay.getDay() + lastDay.getDate())
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        day,
        isOtherMonth: true,
        isToday: false,
        isSelected: false,
        date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, day),
        availabilityInfo: false,
      })
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
