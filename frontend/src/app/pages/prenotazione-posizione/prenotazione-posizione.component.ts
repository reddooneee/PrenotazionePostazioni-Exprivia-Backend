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
  currentDate: Date = new Date()
  selectedDates: Date[] = []
  calendarDays: CalendarDay[] = []
  selectedLocation = ""
  initialSelectedTime = "08:00"
  showAlertDate = false
  showAlertLocation = false
  showAlertType = false
  showAlertFloor = false
  showAlertWorkspace = false
  showSummary = false
  showStep2 = false
  timeOptions: string[] = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ]
  timeSlots: string[] = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ]
  typeOptions: string[] = []
  floorOptions: string[] = []
  workspaceOptions: WorkspaceOption[] = []
  currentMonth = ""
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

  // Aggiorna la settimana corrente
  updateCurrentWeek(): void {
    this.currentWeekDays = []
    const startOfWeek = new Date(this.currentDate)
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      this.currentWeekDays.push(day)
    }
  }

  // Ottieni il range di date della settimana corrente
  getWeekDateRange(): string {
    if (this.currentWeekDays.length === 0) return ""

    const firstDay = this.currentWeekDays[0]
    const lastDay = this.currentWeekDays[6]

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
    return `${firstDay.toLocaleDateString("it-IT", options)} - ${lastDay.toLocaleDateString("it-IT", options)}`
  }

  // Naviga alla settimana precedente
  prevWeek(): void {
    const firstDayOfWeek = this.currentWeekDays[0]
    this.currentDate = new Date(firstDayOfWeek)
    this.currentDate.setDate(this.currentDate.getDate() - 7)
    this.updateCurrentWeek()
    this.cdr.detectChanges()
  }

  // Naviga alla settimana successiva
  nextWeek(): void {
    const lastDayOfWeek = this.currentWeekDays[6]
    this.currentDate = new Date(lastDayOfWeek)
    this.currentDate.setDate(this.currentDate.getDate() + 1)
    this.updateCurrentWeek()
    this.cdr.detectChanges()
  }

  // Cambia la vista del calendario
  switchView(view: string): void {
    this.calendarView = view
    if (view === "week") {
      this.updateCurrentWeek()
    }
    this.cdr.detectChanges()
  }

  // Ottieni il nome del giorno
  getDayName(date: Date): string {
    const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
    return days[date.getDay()]
  }

  // Verifica se una data è oggi
  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString()
  }

  // Verifica se una data è un weekend
  isWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6 // 0 = domenica, 6 = sabato
  }

  // Verifica se un time slot è selezionato
  isTimeSlotSelected(date: Date, hour: string): boolean {
    return this.timeSlotBookings.some(
      (booking) =>
        booking.date.toDateString() === date.toDateString() && booking.hour === hour && booking.booking !== null,
    )
  }

  // Verifica se un time slot è disponibile
  isTimeSlotAvailable(date: Date, hour: string): boolean {
    // Se è weekend, non fare nulla
    if (this.isWeekend(date)) {
      return false
    }

    // Simulazione di disponibilità
    const day = date.getDay()
    const hourNum = Number.parseInt(hour.split(":")[0])

    // Giorni feriali: meno disponibilità nelle ore di punta
    if ((day === 2 || day === 4) && hourNum >= 10 && hourNum <= 15) {
      return Math.random() > 0.7 // 30% di disponibilità
    }

    return Math.random() > 0.4 // 60% di disponibilità
  }

  // Ottieni la prenotazione per un time slot
  getBookingForTimeSlot(date: Date, hour: string): string | null {
    const booking = this.timeSlotBookings.find((b) => b.date.toDateString() === date.toDateString() && b.hour === hour)
    return booking ? booking.booking : null
  }

  // Seleziona/deseleziona un time slot
  toggleTimeSlotSelection(date: Date, hour: string): void {
    // Se è weekend, non fare nulla
    if (this.isWeekend(date)) {
      return
    }

    const existingIndex = this.timeSlotBookings.findIndex(
      (b) => b.date.toDateString() === date.toDateString() && b.hour === hour,
    )

    if (existingIndex >= 0) {
      // Rimuovi la prenotazione
      this.timeSlotBookings.splice(existingIndex, 1)
    } else {
      // Aggiungi la prenotazione
      this.timeSlotBookings.push({
        date: new Date(date),
        hour,
        booking: "Prenotato",
      })

      // Aggiungi la data alle date selezionate se non è già presente
      if (!this.isDateSelected(date)) {
        this.toggleDateSelection(date)
      }
    }

    this.cdr.detectChanges()
  }

  // Verifica se una data è selezionata
  isDateSelected(date: Date): boolean {
    return this.selectedDates.some((d) => d.toDateString() === date.toDateString())
  }

  // Ottieni l'indice di selezione di una data
  getSelectionIndex(date: Date): number {
    const index = this.selectedDates.findIndex((d) => d.toDateString() === date.toDateString())
    return index >= 0 ? index + 1 : 0
  }

  // Seleziona/deseleziona una data
  toggleDateSelection(date: Date): void {
    // Se è weekend, non fare nulla
    if (this.isWeekend(date)) {
      return
    }

    const index = this.selectedDates.findIndex((d) => d.toDateString() === date.toDateString())

    if (index >= 0) {
      // Rimuovi la data
      this.selectedDates.splice(index, 1)
      this.bookingDetails.splice(index, 1)

      // Aggiorna l'indice della scheda corrente
      if (this.currentDateTab >= this.selectedDates.length) {
        this.currentDateTab = Math.max(0, this.selectedDates.length - 1)
      }
    } else {
      // Aggiungi la data
      this.selectedDates.push(new Date(date))
      this.bookingDetails.push({
        selectedType: "",
        selectedFloor: "",
        selectedWorkspace: "",
        selectedTime: "08:00",
        dipendenti: [],
      })

      // Imposta la scheda corrente sulla nuova data
      this.currentDateTab = this.selectedDates.length - 1
    }

    // Aggiorna il calendario
    this.renderCalendar()
    this.calculateAvailability()
    this.showAlertDate = false
    this.cdr.detectChanges()
  }

  // Rimuovi una data selezionata
  removeSelectedDate(index: number): void {
    this.selectedDates.splice(index, 1)
    this.bookingDetails.splice(index, 1)

    // Aggiorna l'indice della scheda corrente
    if (this.currentDateTab >= this.selectedDates.length) {
      this.currentDateTab = Math.max(0, this.selectedDates.length - 1)
    }

    // Aggiorna il calendario
    this.renderCalendar()
    this.calculateAvailability()
    this.cdr.detectChanges()
  }

  // Cambia la scheda della data corrente
  switchDateTab(index: number): void {
    this.currentDateTab = index
    this.updateWorkspaceOptions()
    this.cdr.detectChanges()
  }

  // Verifica se tutte le prenotazioni sono complete
  areAllBookingsComplete(): boolean {
    if (this.bookingDetails.length === 0) return false

    return this.bookingDetails.every(
      (booking) => booking.selectedType && booking.selectedFloor && booking.selectedWorkspace,
    )
  }

  // Calcola la disponibilità per un giorno specifico
  calculateAvailableCount(date: Date): number {
    // Se è weekend, disponibilità zero
    if (this.isWeekend(date)) {
      return 0
    }

    // Cerca la disponibilità memorizzata
    const dateString = date.toDateString()
    const storedAvailability = this.dateAvailabilities.find((a) => a.date === dateString)

    if (storedAvailability) {
      return storedAvailability.availableCount
    }

    // Se non c'è una disponibilità memorizzata, genera una nuova
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

    // Memorizza la disponibilità
    this.dateAvailabilities.push({
      date: dateString,
      availableCount,
    })

    return availableCount
  }

  // Ottieni la classe di disponibilità in base al numero di postazioni disponibili
  getAvailabilityClass(availableCount: number): string {
    const totalCount = this.totalWorkspaces
    const availabilityPercentage = (availableCount / totalCount) * 100

    if (availabilityPercentage > 70) return "high-availability"
    else if (availabilityPercentage > 30) return "medium-availability"
    else return "low-availability"
  }

  // Calcola la disponibilità per le date selezionate
  calculateAvailability(): void {
    if (this.selectedDates.length === 0) return

    let totalAvailable = 0
    let totalCount = 0

    for (const date of this.selectedDates) {
      const availableCount = this.calculateAvailableCount(date)
      totalAvailable += availableCount
      totalCount += this.totalWorkspaces
    }

    const avgAvailabilityPercentage = (totalAvailable / totalCount) * 100

    if (avgAvailabilityPercentage > 70) {
      this.availabilityStatus = {
        level: "alta",
        text: "Alta disponibilità",
        description: `In media ${Math.floor(totalAvailable / this.selectedDates.length)} postazioni disponibili per giorno`,
        dotClass: "available",
        availableCount: totalAvailable,
        totalCount: totalCount,
      }
    } else if (avgAvailabilityPercentage > 30) {
      this.availabilityStatus = {
        level: "media",
        text: "Media disponibilità",
        description: `In media ${Math.floor(totalAvailable / this.selectedDates.length)} postazioni disponibili per giorno`,
        dotClass: "medium",
        availableCount: totalAvailable,
        totalCount: totalCount,
      }
    } else {
      this.availabilityStatus = {
        level: "bassa",
        text: "Bassa disponibilità",
        description: `In media solo ${Math.floor(totalAvailable / this.selectedDates.length)} postazioni disponibili per giorno`,
        dotClass: "occupied",
        availableCount: totalAvailable,
        totalCount: totalCount,
      }
    }
  }

  // Naviga al mese precedente
  prevMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.updateMonth()
    this.renderCalendar()
    if (this.calendarView === "week") {
      this.updateCurrentWeek()
    }
    this.cdr.detectChanges()
  }

  // Naviga al mese successivo
  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.updateMonth()
    this.renderCalendar()
    if (this.calendarView === "week") {
      this.updateCurrentWeek()
    }
    this.cdr.detectChanges()
  }

  // Metodo chiamato quando cambia la sede
  onLocationChange(): void {
    this.resetOptions()
    this.updateTypeOptions()
    this.updateFloorOptions()

    // TODO: Carica le preferenze salvate dal backend per la sede selezionata
    // loadPreferencesFromBackend(this.selectedLocation).then(preferences => {
    //   this.preferredWorkspaces = preferences || ["", ""];
    // });

    // Aggiorna le disponibilità quando cambia la sede
    this.updateRandomAvailabilities()
    this.renderCalendar()
    this.cdr.detectChanges()
  }

  // Metodo chiamato quando cambia il tipo di prenotazione
  onTypeChange(tabIndex: number): void {
    this.showAlertType = false
    this.bookingDetails[tabIndex].selectedFloor = "" // Resetta il piano
    this.bookingDetails[tabIndex].selectedWorkspace = "" // Resetta la postazione
    this.updateFloorOptions()
    this.updateTimeOptions(tabIndex)
    this.cdr.detectChanges()
  }

  // Metodo chiamato quando cambia il piano
  onFloorChange(tabIndex: number): void {
    this.showAlertFloor = false
    this.bookingDetails[tabIndex].selectedWorkspace = "" // Resetta la postazione
    this.updateWorkspaceOptions()

    // Reset the floor plan markers if the modal is open
    if (this.showFloorPlanModal) {
      this.loadFloorPlanMarkers()
    }

    this.cdr.detectChanges()
  }

  // Aggiorna le opzioni di tipo in base alla sede selezionata
  updateTypeOptions(): void {
    this.typeOptions = this.getTypeOptions()
  }

  // Aggiorna le opzioni di piano in base al tipo selezionato
  updateFloorOptions(): void {
    const selectedType = this.bookingDetails[this.currentDateTab]?.selectedType || ""
    this.floorOptions = this.getFloorOptions(selectedType)
  }

  // Aggiorna le opzioni di postazione in base al piano selezionato
  updateWorkspaceOptions(): void {
    const selectedFloor = this.bookingDetails[this.currentDateTab]?.selectedFloor || ""
    const selectedType = this.bookingDetails[this.currentDateTab]?.selectedType || ""
    const currentDate = this.selectedDates[this.currentDateTab]

    // Ottieni la disponibilità per la data corrente
    let availableCount = 0
    if (currentDate) {
      availableCount = this.calculateAvailableCount(currentDate)
    }

    // Calcola quante postazioni mostrare come disponibili
    const maxAvailableWorkspaces = availableCount

    // Aggiorna le opzioni di postazione in base al piano selezionato
    this.workspaceOptions = []

    // Filtra le postazioni dal database in base al piano e tipo selezionati
    const filteredWorkspaces = this.workspacesDatabase.filter(
      (workspace) =>
        workspace.floor === selectedFloor &&
        (workspace.type === selectedType ||
          (selectedType.includes("Sala Riunione") && workspace.type === "Sala Riunione")),
    )

    // Crea le opzioni di postazione
    if (filteredWorkspaces.length > 0) {
      this.workspaceOptions = filteredWorkspaces.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        status: "available", // Stato predefinito, verrà aggiornato sotto
        selected: false,
      }))
    } else {
      this.workspaceOptions = [
        {
          id: "none",
          name: "Nessuna opzione disponibile",
          status: "occupied",
          selected: false,
        },
      ]
    }

    // Simula lo stato delle postazioni in base alla disponibilità
    // TODO: In futuro, questa logica sarà sostituita da dati reali dal backend
    let availableWorkspaces = 0
    this.workspaceOptions.forEach((workspace) => {
      // Le postazioni preferite hanno maggiore probabilità di essere disponibili (per demo)
      const isPreferred = this.preferredWorkspaces.includes(workspace.id)

      // Se abbiamo raggiunto il massimo di postazioni disponibili, marca le rimanenti come occupate o riservate
      if (availableWorkspaces < maxAvailableWorkspaces || isPreferred) {
        const random = Math.random()
        if (random < 0.1 && !isPreferred) {
          workspace.status = "reserved" // 10% riservate, ma le preferite hanno priorità
        } else {
          workspace.status = "available" // 90% disponibili
          availableWorkspaces++
        }
      } else {
        workspace.status = Math.random() < 0.5 ? "occupied" : "reserved" // 50% occupate, 50% riservate
      }
    })

    // Marca come selezionata la postazione già scelta
    const selectedWorkspace = this.bookingDetails[this.currentDateTab]?.selectedWorkspace || ""
    if (selectedWorkspace) {
      const workspace = this.workspaceOptions.find((w) => w.name === selectedWorkspace)
      if (workspace) {
        workspace.selected = true
      }
    }
  }

  // Aggiorna le opzioni di orario in base al tipo selezionato
  updateTimeOptions(tabIndex: number): void {
    const selectedType = this.bookingDetails[tabIndex]?.selectedType || ""

    if (selectedType === "Postazione - Giornata intera" || selectedType === "Sala Riunione - Giornata Intera") {
      this.timeOptions = ["08:00"]
      this.bookingDetails[tabIndex].selectedTime = "08:00" // Seleziona automaticamente l'orario alle 8:00
    } else {
      this.timeOptions = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ]
    }
  }

  // Seleziona una postazione
  selectWorkspace(workspace: WorkspaceOption, tabIndex: number): void {
    if (workspace.status !== "occupied") {
      this.workspaceOptions.forEach((w) => (w.selected = false))
      workspace.selected = true
      this.bookingDetails[tabIndex].selectedWorkspace = workspace.name
      this.showAlertWorkspace = false
    }
  }

  // Aggiorna il metodo nextStep() per controllare le postazioni preferite quando si passa al secondo step
  nextStep(): void {
    this.showAlertDate = false
    this.showAlertLocation = false
    this.showAlertType = false
    this.showAlertFloor = false
    this.showAlertWorkspace = false

    if (!this.showStep2) {
      if (this.selectedDates.length === 0) {
        this.showAlertDate = true
        return
      }
      if (!this.selectedLocation) {
        this.showAlertLocation = true
        return
      }
      this.showStep2 = true

      // NUOVO: Inizializza i dettagli di prenotazione con valori predefiniti per ogni data
      for (let i = 0; i < this.bookingDetails.length; i++) {
        // Imposta il tipo di prenotazione predefinito
        if (!this.bookingDetails[i].selectedType && this.typeOptions.length > 0) {
          this.bookingDetails[i].selectedType = this.typeOptions[0]

          // Imposta il piano predefinito in base al tipo
          if (this.bookingDetails[i].selectedType && !this.bookingDetails[i].selectedFloor) {
            const floors = this.getFloorOptions(this.bookingDetails[i].selectedType)
            if (floors.length > 0) {
              this.bookingDetails[i].selectedFloor = floors[0]
            }
          }
        }
      }

      // Aggiorna le opzioni di postazione e controlla se le preferite sono disponibili
      setTimeout(() => {
        this.updateWorkspaceOptions()
        this.trySelectPreferredWorkspaces()
      }, 100)
    } else {
      if (!this.areAllBookingsComplete()) {
        // Verifica quale prenotazione è incompleta
        for (let i = 0; i < this.bookingDetails.length; i++) {
          const booking = this.bookingDetails[i]
          if (!booking.selectedType) {
            this.showAlertType = true
            this.currentDateTab = i
            return
          }
          if (!booking.selectedFloor) {
            this.showAlertFloor = true
            this.currentDateTab = i
            return
          }
          if (!booking.selectedWorkspace) {
            this.showAlertWorkspace = true
            this.currentDateTab = i
            return
          }
        }
      }
      this.showSummary = true
    }
  }

  // NUOVO: Metodo per tentare di selezionare automaticamente le postazioni preferite
  trySelectPreferredWorkspaces(): void {
    // Per ogni data selezionata, prova a selezionare una postazione preferita
    for (let i = 0; i < this.selectedDates.length; i++) {
      // Prima controlla se una delle postazioni preferite è disponibile
      let preferredWorkspaceFound = false

      // Controlla la prima preferenza
      if (this.preferredWorkspaces[0]) {
        const preferredId = this.preferredWorkspaces[0]
        const preferred = this.workspaceOptions.find((w) => w.id === preferredId && w.status === "available")
        if (preferred) {
          this.switchDateTab(i)
          this.selectWorkspace(preferred, i)
          preferredWorkspaceFound = true
          console.log(
            `Selezionata automaticamente la prima postazione preferita ${preferred.name} per la data ${this.selectedDates[i].toLocaleDateString()}`,
          )
        }
      }

      // Se la prima preferenza non è disponibile, controlla la seconda
      if (!preferredWorkspaceFound && this.preferredWorkspaces[1]) {
        const preferredId = this.preferredWorkspaces[1]
        const preferred = this.workspaceOptions.find((w) => w.id === preferredId && w.status === "available")
        if (preferred) {
          this.switchDateTab(i)
          this.selectWorkspace(preferred, i)
          preferredWorkspaceFound = true
          console.log(
            `Selezionata automaticamente la seconda postazione preferita ${preferred.name} per la data ${this.selectedDates[i].toLocaleDateString()}`,
          )
        }
      }
    }

    // Torna alla prima scheda dopo aver controllato tutte le date
    this.switchDateTab(0)
  }

  // Modifico il metodo confirmBooking per includere i dipendenti nelle prenotazioni
  confirmBooking(): void {
    // TODO: Integrazione con il backend
    // 1. Preparare i dati da inviare al backend
    const bookingData = {
      location: this.selectedLocation,
      preferredLocations: this.preferredWorkspaces.filter((id) => id && id.trim() !== ""),
      bookings: this.selectedDates.map((date, index) => ({
        date: date.toISOString(),
        type: this.bookingDetails[index].selectedType,
        floor: this.bookingDetails[index].selectedFloor,
        workspace: this.bookingDetails[index].selectedWorkspace,
        time: this.bookingDetails[index].selectedTime,
        employees: this.bookingDetails[index].dipendenti,
      })),
    }

    console.log("Dati da inviare al backend:", bookingData)

    // 2. Chiamata API al backend
    // const response = await fetch('/api/bookings', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(bookingData)
    // });

    // 3. Gestione della risposta
    // if (response.ok) {
    //   const result = await response.json();
    //   // Mostra conferma e resetta il form
    //   alert(`Prenotazioni confermate! ID: ${result.bookingId}`);
    //   this.resetBooking();
    // } else {
    //   // Gestione errori
    //   alert('Errore durante la prenotazione. Riprova più tardi.');
    // }

    // Aggiungi le nuove prenotazioni allo storico dell'utente
    const newUserBookings: UserBooking[] = this.selectedDates.map((date, index) => {
      // Verifica se ci sono dipendenti aggiunti alla prenotazione
      const hasDipendenti = this.bookingDetails[index].dipendenti && this.bookingDetails[index].dipendenti.length > 0

      return {
        id: this.userBookings.length + index + 1,
        date: new Date(date),
        location: this.selectedLocation,
        floor: this.bookingDetails[index].selectedFloor,
        workspace: this.bookingDetails[index].selectedWorkspace,
        type: this.bookingDetails[index].selectedType,
        time: this.bookingDetails[index].selectedTime,
        // Se ci sono dipendenti, li includiamo nella prenotazione
        employees: hasDipendenti ? [...this.bookingDetails[index].dipendenti] : [],
      }
    })

    this.userBookings = [...this.userBookings, ...newUserBookings]

    // Per ora mostriamo solo un alert
    alert("Prenotazioni confermate!")
    this.resetBooking()
  }

  // Torna indietro
  backToDetails(): void {
    if (this.showSummary) {
      this.showSummary = false
      this.showStep2 = true
    } else {
      this.showStep2 = false
    }
  }

  // Resetta la prenotazione
  resetBooking(): void {
    this.selectedDates = []
    this.selectedLocation = ""
    this.bookingDetails = []
    this.timeSlotBookings = []
    this.showSummary = false
    this.showStep2 = false
    this.showAlertDate = false
    this.showAlertLocation = false
    this.showAlertType = false
    this.showAlertFloor = false
    this.showAlertWorkspace = false
    this.currentDateTab = 0
    this.preferredWorkspaces = ["", ""] // Resetta le postazioni preferite
    this.updateMonth()
    this.renderCalendar()
    this.resetOptions()
    this.updateTypeOptions()
    this.updateFloorOptions()
    this.updateWorkspaceOptions()
    this.cdr.detectChanges()
  }

  // Resetta le opzioni
  resetOptions(): void {
    this.typeOptions = []
    this.floorOptions = []
    this.workspaceOptions = []
    this.bookingDetails = this.selectedDates.map(() => ({
      selectedType: "",
      selectedFloor: "",
      selectedWorkspace: "",
      selectedTime: "08:00",
      dipendenti: [],
    }))
    this.timeOptions = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ]
  }

  // Abilita le opzioni
  enableOptions(): void {
    // Implementa la logica per abilitare le opzioni
  }

  // Add these new methods to the class

  // Open the floor plan modal
  openFloorPlan(): void {
    if (!this.bookingDetails[this.currentDateTab].selectedFloor) return

    this.showFloorPlanModal = true
    this.floorPlanZoom = 1
    this.panPosition = { x: 0, y: 0 }
    this.loadFloorPlanMarkers()
    this.cdr.detectChanges()
  }

  // Close the floor plan modal
  closeFloorPlanModal(): void {
    this.showFloorPlanModal = false
    this.cdr.detectChanges()
  }

  // Load markers for the selected floor
  loadFloorPlanMarkers(): void {
    const selectedFloor = this.bookingDetails[this.currentDateTab].selectedFloor
    const selectedType = this.bookingDetails[this.currentDateTab].selectedType

    // Get available workstations for the current floor
    const availableWorkspaces = this.getAvailableWorkspacesForFloor(selectedFloor, selectedType)

    // Generate markers based on the floor plan
    this.floorPlanMarkers = this.generateMarkersForFloor(selectedFloor, availableWorkspaces)
    this.cdr.detectChanges()
  }

  // Get available workstations for a floor
  getAvailableWorkspacesForFloor(floor: string, type: string): string[] {
    // Filter workspaces by floor and type
    const workspaces = this.workspacesDatabase.filter(
      (workspace) =>
        workspace.floor === floor &&
        (workspace.type === type || (type.includes("Sala Riunione") && workspace.type === "Sala Riunione")),
    )

    // Get the names of the workspaces
    return workspaces.map((workspace) => workspace.name)
  }

  // Generate markers for a floor
  generateMarkersForFloor(floorName: string, availableWorkspaces: string[]): FloorPlanMarker[] {
    // Map of room coordinates based on the floor plan
    const roomCoordinates: Record<string, { x: number; y: number; workstations: string[] }> = {
     
      "Stanza A16": {
        x: 740,
        y: 200,
        workstations: ["A16 - Postazione 3", "A16 - Postazione 4", "A16 - Postazione 5"],
      },
      "Stanza A22": {
        x: 580,
        y: 520,
        workstations: ["A22 - Postazione 20", "A22 - Postazione 21", "A22 - Postazione 22", "A22 - Postazione 23"],
      },
      "Stanza A26": {
        x: 300,
        y: 560,
        workstations: [
          "A26 - Postazione 75",
          "A26 - Postazione 76",
          "A26 - Postazione 77",
          "A26 - Postazione 78",
          "A26 - Postazione 79",
          "A26 - Postazione 80",
        ],
      },
     
      "Stanza A31": {
        x: 340,
        y: 400,
        workstations: ["A31 - Postazione 66", "A31 - Postazione 67", "A31 - Postazione 68"],
      },
      "Stanza A3.A": { x: 140, y: 320, workstations: ["A3.A - Postazione 36"] },
      "Sala Riunioni Gastone (8 Postazioni)": { x: 500, y: 280, workstations: ["Sala Gastone"] },
      "Sala Riunioni Keplero (12 Postazioni)": { x: 300, y: 320, workstations: ["Sala Keplero"] },
      "Sala Riunioni Leonardo (7 Postazioni)": { x: 420, y: 480, workstations: ["Sala Leonardo"] },
    }

    // If the floor name exactly matches a key in roomCoordinates, use only that room
    if (roomCoordinates[floorName]) {
      const room = floorName
      const roomData = roomCoordinates[room]

      return roomData.workstations.map((workstation, index) => {
        // Calculate position with slight offset for multiple workstations in the same room
        const offsetX = index % 2 === 0 ? -15 : 15
        const offsetY = index > 1 ? 15 : index > 0 ? -15 : 0

        return {
          id: `${room}-${index + 1}`,
          x: roomData.x + offsetX,
          y: roomData.y + offsetY,
          room: room,
          workstation: workstation,
          available: availableWorkspaces.includes(workstation),
        }
      })
    }

    // Otherwise, filter rooms based on the floor name
    const filteredRooms = Object.keys(roomCoordinates).filter((room) =>
      room.toLowerCase().includes(floorName.toLowerCase().replace("stanza ", "")),
    )

    // Create markers for each workstation in the filtered rooms
    const markers: FloorPlanMarker[] = []

    filteredRooms.forEach((room) => {
      const roomData = roomCoordinates[room]

      roomData.workstations.forEach((workstation, index) => {
        // Calculate position with slight offset for multiple workstations in the same room
        const offsetX = index % 2 === 0 ? -15 : 15
        const offsetY = index > 1 ? 15 : index > 0 ? -15 : 0

        markers.push({
          id: `${room}-${index + 1}`,
          x: roomData.x + offsetX,
          y: roomData.y + offsetY,
          room: room,
          workstation: workstation,
          available: availableWorkspaces.includes(workstation),
        })
      })
    })

    return markers
  }

  // Select a workstation from the floor plan
  selectWorkspaceFromMap(marker: FloorPlanMarker): void {
    if (!marker.available) return

    this.selectedMarker = marker.id

    // Update the booking details
    this.bookingDetails[this.currentDateTab].selectedFloor = marker.room
    this.updateFloorOptions()
    this.updateWorkspaceOptions()

    // Find and select the workspace in the options
    setTimeout(() => {
      const workspace = this.workspaceOptions.find((w) => w.name === marker.workstation)
      if (workspace) {
        this.selectWorkspace(workspace, this.currentDateTab)
      }

      // Reset the selected marker after a delay
      setTimeout(() => {
        this.selectedMarker = null
        this.cdr.detectChanges()
      }, 1500)
    }, 100)

    this.cdr.detectChanges()
  }

  // Zoom controls
  zoomIn(): void {
    this.floorPlanZoom = Math.min(this.floorPlanZoom + 0.1, 2)
    this.cdr.detectChanges()
  }

  zoomOut(): void {
    this.floorPlanZoom = Math.max(this.floorPlanZoom - 0.1, 0.5)
    this.cdr.detectChanges()
  }

  resetZoom(): void {
    this.floorPlanZoom = 1
    this.panPosition = { x: 0, y: 0 }
    this.cdr.detectChanges()
  }

  // Pan controls
  startPan(event: MouseEvent): void {
    this.isPanning = true
    this.panStart = {
      x: event.clientX - this.panPosition.x,
      y: event.clientY - this.panPosition.y,
    }
    this.cdr.detectChanges()
  }

  pan(event: MouseEvent): void {
    if (!this.isPanning) return

    this.panPosition = {
      x: event.clientX - this.panStart.x,
      y: event.clientY - this.panStart.y,
    }
    this.cdr.detectChanges()
  }

  endPan(): void {
    this.isPanning = false
    this.cdr.detectChanges()
  }

  // Metodo per aprire la modale della planimetria
  apriPlanimetria(): void {
    if (!this.bookingDetails[this.currentDateTab].selectedFloor) return

    // Ottieni le postazioni disponibili per il piano corrente
    const postazioniDisponibili = this.getPostazioniDisponibiliPerPianoCorrente()

    // Mostra la modale della planimetria
    this.mostraPlanimetriaModale = true
    this.cdr.detectChanges()
  }

  // Metodo per chiudere la modale della planimetria
  chiudiPlanimetriaModale(): void {
    this.mostraPlanimetriaModale = false
    this.cdr.detectChanges()
  }

  // Metodo per gestire la selezione di una postazione dalla planimetria
  onSelezionePostazioneDaPlanimetria(evento: { stanza: string; postazione: string }): void {
    // Aggiorna i dettagli della prenotazione con la stanza selezionata
    this.bookingDetails[this.currentDateTab].selectedFloor = evento.stanza
    this.updateFloorOptions()
    this.updateWorkspaceOptions()

    // Trova e seleziona la postazione specifica nelle opzioni
    setTimeout(() => {
      // Cerca la postazione esatta per nome
      const workspace = this.workspaceOptions.find((w) => w.name === evento.postazione)
      if (workspace) {
        this.selectWorkspace(workspace, this.currentDateTab)

        // Chiudi la modale dopo un breve ritardo
        setTimeout(() => {
          this.chiudiPlanimetriaModale()
        }, 1000)
      } else {
        console.error(`Postazione non trovata: ${evento.postazione}`)
      }
    }, 100)
  }

  // Aggiungi questo metodo alla classe PrenotazionePosizioneComponent
  // Ottieni le postazioni disponibili per il piano corrente
  getPostazioniDisponibiliPerPianoCorrente(): string[] {
    const selectedFloor = this.bookingDetails[this.currentDateTab]?.selectedFloor || ""
    const selectedType = this.bookingDetails[this.currentDateTab]?.selectedType || ""

    // Filtra le postazioni disponibili
    return this.workspaceOptions.filter((w) => w.status === "available").map((w) => w.name)
  }
}
