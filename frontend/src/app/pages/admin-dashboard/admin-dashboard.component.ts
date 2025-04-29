import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { FilterByFloorPipe } from "../../filter-by-floor.pipe"

interface CalendarDay {
  date: Date
  day: number
  isOtherMonth: boolean
  isToday: boolean
  isSelected: boolean
  bookingsCount: number
  dayOfWeek: number
  availabilityInfo?: string
  availabilityClass?: string
  availableCount?: number
}

interface Booking {
  id: number
  userId: string
  userName: string
  userEmail: string
  date: Date
  time: string
  location: string
  floor: string
  type: string // Cosa e Durata
  workspace: string
}

interface DateAvailability {
  date: string // Data in formato stringa
  availableCount: number
  totalCount: number
}

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, FilterByFloorPipe],
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  showAlertDate = false
  showAlertUser = false
  showAlertEmail = false
  showAlertType = false
  showAlertFloor = false
  showAlertWorkspace = false

  // Navbar
  activeTab = "statistiche"
  adminName = "Maria Rossi"

  // Calendar
  currentDate = new Date()
  selectedDates: Date[] = []
  calendarDays: CalendarDay[] = []
  currentMonth = ""
  multiDateSelectionEnabled = false
  applyToAllDates = false

  // Bookings
  allBookings: Booking[] = []
  filteredBookings: Booking[] = []

  // Filters
  locations = [
    "Lecce",
    "Matera",
    "Milano Valtorta",
    "Molfetta (Casette)",
    "Molfetta (Pal. Agnelli)",
    "Molfetta (Pal. Bianca)",
    "Molfetta (Pal. Rossa)",
    "Palermo",
    "Roma (Bufalotta)",
    "Spaces Roma",
    "Trento",
    "Vicenza",
  ]

  // Cosa e Durata (allineato con l'interfaccia utente)
  typeOptions = [
    "Postazione - Giornata intera",
    "Sala Riunione - Giornata Intera",
    "Sala Riunione - 30 min",
    "Sala Riunione - 60 min",
    "Sala Riunione - 120 min",
    "Sala Riunione - 4 ore",
  ]

  // Piano (allineato con l'interfaccia utente)
  floorOptions = [
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
    "Sala Riunioni Gastone (8 Postazioni)",
    "Sala Riunioni Keplero (12 Postazioni)",
    "Sala Riunioni Leonardo (7 Postazioni)",
  ]

  // Postazione (allineato con l'interfaccia utente)
  workspaceOptions = [
    { floor: "Stanza A10", workspace: "A10 - Postazione 56" },
    { floor: "Stanza A10", workspace: "A10 - Postazione 57" },
    { floor: "Stanza A10", workspace: "A10 - Postazione 58" },
    { floor: "Stanza A16", workspace: "A16 - Postazione 3" },
    { floor: "Stanza A16", workspace: "A16 - Postazione 4" },
    { floor: "Stanza A16", workspace: "A16 - Postazione 5" },
    { floor: "Stanza A22", workspace: "A22 - Postazione 20" },
    { floor: "Stanza A22", workspace: "A22 - Postazione 21" },
    { floor: "Stanza A22", workspace: "A22 - Postazione 22" },
    { floor: "Stanza A22", workspace: "A22 - Postazione 23" },
    { floor: "Stanza A6", workspace: "A6 - Postazione 43" },
    { floor: "Stanza A6", workspace: "A6 - Postazione 44" },
    { floor: "Stanza A6", workspace: "A6 - Postazione 45" },
    { floor: "Stanza A3.A", workspace: "A3.A - Postazione 36" },
    { floor: "Stanza A26", workspace: "A26 - Postazione 75" },
    { floor: "Stanza A26", workspace: "A26 - Postazione 76" },
    { floor: "Stanza A26", workspace: "A26 - Postazione 77" },
    { floor: "Stanza A26", workspace: "A26 - Postazione 78" },
    { floor: "Stanza A26", workspace: "A26 - Postazione 79" },
    { floor: "Stanza A26", workspace: "A26 - Postazione 80" },
    { floor: "Stanza A31", workspace: "A31 - Postazione 66" },
    { floor: "Stanza A31", workspace: "A31 - Postazione 67" },
    { floor: "Stanza A31", workspace: "A31 - Postazione 68" },
    { floor: "Stanza A8", workspace: "A8 - Postazione 49" },
    { floor: "Stanza A8", workspace: "A8 - Postazione 50" },
    { floor: "Stanza A8", workspace: "A8 - Postazione 51" },
    { floor: "Stanza A20", workspace: "A20 - Postazione 10" },
    { floor: "Stanza A20", workspace: "A20 - Postazione 11" },
    { floor: "Stanza A20", workspace: "A20 - Postazione 12" },
    { floor: "Stanza A20", workspace: "A20 - Postazione 13" },
    { floor: "Stanza A9", workspace: "A9 - Postazione 52" },
    { floor: "Stanza A9", workspace: "A9 - Postazione 53" },
    { floor: "Stanza A9", workspace: "A9 - Postazione 54" },
    { floor: "Stanza A9", workspace: "A9 - Postazione 55" },
    { floor: "Sala Riunioni Gastone (8 Postazioni)", workspace: "Sala Gastone" },
    { floor: "Sala Riunioni Keplero (12 Postazioni)", workspace: "Sala Keplero" },
    { floor: "Sala Riunioni Leonardo (7 Postazioni)", workspace: "Sala Leonardo" },
  ]

  // Orari disponibili
  timeOptions = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  // Filter selections
  filterType = ""
  filterFloor = ""
  filterWorkspace = ""
  filterTime = ""

  // Modal
  showEditModal = false
  showAddModal = false
  currentBooking: Booking | null = null
  newBooking: Booking = {
    id: 0,
    userId: "",
    userName: "",
    userEmail: "",
    date: new Date(),
    time: "",
    location: "Roma (Bufalotta)",
    floor: "",
    type: "",
    workspace: "",
  }

  // Postazioni filtrate per piano
  filteredWorkspaceOptions: { floor: string; workspace: string }[] = []

  // Disponibilità per data
  dateAvailabilities: DateAvailability[] = []

  // Numero totale di postazioni
  totalWorkspaces = 34

  constructor() {}

  ngOnInit(): void {
    this.generateMockBookings() // TODO: Sostituire con una chiamata al backend per ottenere le prenotazioni reali
    this.generateRandomAvailabilities() // Genera disponibilità casuali
    this.generateCalendar()
    this.updateMonthDisplay()
  }

  // Genera disponibilità casuali per le date
  generateRandomAvailabilities(): void {
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

      if (day === 2 || day === 4) {
        // Martedì e giovedì: meno disponibilità (20-40%)
        availableCount = Math.floor(this.totalWorkspaces * (0.2 + Math.random() * 0.2))
      } else {
        // Altri giorni: più disponibilità (40-80%)
        availableCount = Math.floor(this.totalWorkspaces * (0.4 + Math.random() * 0.4))
      }

      this.dateAvailabilities.push({
        date: date.toDateString(),
        availableCount,
        totalCount: this.totalWorkspaces,
      })
    }
  }

  // Cambia la tab attiva nella navbar
  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  // Logout dell'utente
  logout(): void {
    console.log("Logout clicked")
    // TODO: Implementare la logica di logout (es. chiamata al backend per invalidare il token)
  }

  // Genera il calendario
  generateCalendar(): void {
    this.calendarDays = []
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    // Primo giorno del mese
    const firstDay = new Date(year, month, 1)
    // Ultimo giorno del mese
    const lastDay = new Date(year, month + 1, 0)

    // Giorno della settimana del primo giorno (0 = Domenica, 6 = Sabato)
    const firstDayOfWeek = firstDay.getDay()

    // Aggiungi i giorni del mese precedente
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      this.calendarDays.push({
        date: date,
        day: prevMonthLastDay - i,
        isOtherMonth: true,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date),
        bookingsCount: this.countBookingsForDate(date),
        dayOfWeek: date.getDay(),
        availabilityClass: this.getAvailabilityClass(date),
        availableCount: this.getAvailableCount(date),
      })
    }

    // Aggiungi i giorni del mese corrente
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      this.calendarDays.push({
        date: date,
        day: i,
        isOtherMonth: false,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date),
        bookingsCount: this.countBookingsForDate(date),
        dayOfWeek: date.getDay(),
        availabilityInfo: "true",
        availabilityClass: this.getAvailabilityClass(date),
        availableCount: this.getAvailableCount(date),
      })
    }

    // Aggiungi i giorni del mese successivo
    const remainingDays = 42 - this.calendarDays.length // 6 righe x 7 giorni = 42 celle
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      this.calendarDays.push({
        date: date,
        day: i,
        isOtherMonth: true,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date),
        bookingsCount: this.countBookingsForDate(date),
        dayOfWeek: date.getDay(),
        availabilityClass: this.getAvailabilityClass(date),
        availableCount: this.getAvailableCount(date),
      })
    }
  }

  // Aggiorna la visualizzazione del mese corrente
  updateMonthDisplay(): void {
    const options = { month: "long", year: "numeric" } as Intl.DateTimeFormatOptions
    this.currentMonth = this.currentDate.toLocaleDateString("it-IT", options)
  }

  // Naviga al mese precedente
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    this.generateCalendar()
    this.updateMonthDisplay()
  }

  // Naviga al mese successivo
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    this.generateCalendar()
    this.updateMonthDisplay()
  }

  // Ottieni il nome del giorno
  getDayName(date: Date): string {
    const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
    return days[date.getDay()]
  }

  // Abilita/disabilita la selezione multipla
  toggleMultiDateSelection(): void {
    if (!this.multiDateSelectionEnabled) {
      // Se disabilitato, mantieni solo la prima data selezionata (se presente)
      if (this.selectedDates.length > 1) {
        const firstDate = this.selectedDates[0]
        this.selectedDates = [firstDate]
        this.filterBookingsByDates()
      }
    }
  }

  // Seleziona una data
  selectDate(date: Date, dayOfWeek: number): void {
    // Se è weekend, non fare nulla
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return
    }

    if (this.multiDateSelectionEnabled) {
      // Modalità selezione multipla
      const index = this.selectedDates.findIndex((d) => this.isSameDate(d, date))

      if (index !== -1) {
        // Rimuovi la data se già selezionata
        this.selectedDates.splice(index, 1)
      } else {
        // Aggiungi la data se non è già selezionata
        this.selectedDates.push(new Date(date))
      }
    } else {
      // Modalità selezione singola
      this.selectedDates = [new Date(date)]
    }

    // Aggiorna il calendario e filtra le prenotazioni
    this.generateCalendar()
    this.filterBookingsByDates()
  }

  // Rimuovi una data selezionata
  removeSelectedDate(index: number): void {
    this.selectedDates.splice(index, 1)
    this.generateCalendar()
    this.filterBookingsByDates()
  }

  // Verifica se una data è selezionata in modalità multi-selezione
  isMultiSelected(date: Date): boolean {
    return this.selectedDates.some((d) => this.isSameDate(d, date))
  }

  // Ottieni l'indice di una data nella selezione multipla
  getMultiSelectIndex(date: Date): number {
    const index = this.selectedDates.findIndex((d) => this.isSameDate(d, date))
    return index >= 0 ? index + 1 : 0
  }

  // Verifica se una data è oggi
  isToday(date: Date): boolean {
    const today = new Date()
    return this.isSameDate(date, today)
  }

  // Verifica se una data è selezionata
  isSelectedDate(date: Date): boolean {
    return this.selectedDates.some((d) => this.isSameDate(d, date))
  }

  // Confronta due date
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  // Conta le prenotazioni per una data specifica
  countBookingsForDate(date: Date): number {
    return this.allBookings.filter((booking) => this.isSameDate(new Date(booking.date), date)).length
  }

  // Filtra le prenotazioni per le date selezionate
  filterBookingsByDates(): void {
    if (this.selectedDates.length === 0) {
      this.filteredBookings = []
      return
    }

    this.filteredBookings = this.allBookings.filter((booking) =>
      this.selectedDates.some((date) => this.isSameDate(new Date(booking.date), date)),
    )

    this.applyFilters()
  }

  // Applica i filtri alle prenotazioni
  applyFilters(): void {
    if (this.selectedDates.length === 0) return

    let bookings = this.allBookings.filter((booking) =>
      this.selectedDates.some((date) => this.isSameDate(new Date(booking.date), date)),
    )

    if (this.filterType) {
      bookings = bookings.filter((b) => b.type === this.filterType)
    }
    if (this.filterFloor) {
      bookings = bookings.filter((b) => b.floor === this.filterFloor)
    }
    if (this.filterWorkspace) {
      bookings = bookings.filter((b) => b.workspace === this.filterWorkspace)
    }
    if (this.filterTime) {
      bookings = bookings.filter((b) => b.time.startsWith(this.filterTime))
    }

    this.filteredBookings = bookings
  }

  // Resetta i filtri
  resetFilters(): void {
    this.filterType = ""
    this.filterFloor = ""
    this.filterWorkspace = ""
    this.filterTime = ""
    this.filterBookingsByDates()
  }

  // Apre il modal per modificare una prenotazione
  editBooking(booking: Booking): void {
    this.currentBooking = { ...booking }
    this.filteredWorkspaceOptions = this.workspaceOptions.filter((ws) => ws.floor === this.currentBooking!.floor)
    this.showEditModal = true
  }

  // Elimina una prenotazione
  deleteBooking(bookingId: number): void {
    if (confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      this.allBookings = this.allBookings.filter((b) => b.id !== bookingId)
      this.filterBookingsByDates()
      this.generateCalendar() // Aggiorna il conteggio delle prenotazioni nel calendario
      // TODO: Implementare la chiamata al backend per eliminare la prenotazione
    }
  }

  // Salva le modifiche a una prenotazione
  saveBooking(): void {
    if (!this.currentBooking) return

    // Validazione
    if (!this.currentBooking.userName) {
      this.showAlertUser = true
      setTimeout(() => (this.showAlertUser = false), 3000)
      return
    }
    if (!this.currentBooking.userEmail) {
      this.showAlertEmail = true
      setTimeout(() => (this.showAlertEmail = false), 3000)
      return
    }
    if (!this.currentBooking.type) {
      this.showAlertType = true
      setTimeout(() => (this.showAlertType = false), 3000)
      return
    }
    if (!this.currentBooking.floor) {
      this.showAlertFloor = true
      setTimeout(() => (this.showAlertFloor = false), 3000)
      return
    }
    if (!this.currentBooking.workspace) {
      this.showAlertWorkspace = true
      setTimeout(() => (this.showAlertWorkspace = false), 3000)
      return
    }

    // Se è una prenotazione giornata intera, imposta l'orario fisso
    if (this.currentBooking.type.includes("Giornata intera")) {
      this.currentBooking.time = "8 - 18"
    }

    const index = this.allBookings.findIndex((b) => b.id === this.currentBooking!.id)
    if (index !== -1) {
      this.allBookings[index] = { ...this.currentBooking }
    }

    this.showEditModal = false
    this.currentBooking = null

    this.filterBookingsByDates()
    this.generateCalendar() // Aggiorna il conteggio delle prenotazioni nel calendario
    // TODO: Implementare la chiamata al backend per salvare le modifiche
  }

  // Chiude il modal di modifica
  cancelEdit(): void {
    this.showEditModal = false
    this.currentBooking = null
  }

  // Verifica se una data è un weekend
  isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // 0 = Domenica, 6 = Sabato
  }

  // Verifica se ci sono date weekend tra quelle selezionate
  hasWeekendDates(): boolean {
    return this.selectedDates.some((date) => this.isWeekend(date))
  }

  // Filtra le postazioni in base al piano selezionato
  filterWorkspacesByFloor(floor: string): void {
    this.filteredWorkspaceOptions = this.workspaceOptions.filter((ws) => ws.floor === floor)
  }

  // Apre il modal per creare una nuova prenotazione
  openAddBookingModal(): void {
    if (this.selectedDates.length === 0) {
      this.showAlertDate = true
      setTimeout(() => (this.showAlertDate = false), 3000)
      return
    }

    // Inizializza la nuova prenotazione con la prima data selezionata
    this.newBooking = {
      id: 0,
      userId: "",
      userName: "",
      userEmail: "",
      date: this.selectedDates[0],
      time: "",
      location: "Roma (Bufalotta)",
      floor: "",
      type: "",
      workspace: "",
    }

    this.applyToAllDates = false
    this.showAddModal = true
  }

  // Chiude il modal di creazione
  closeAddBookingModal(): void {
    this.showAddModal = false
  }

  // Salva la nuova prenotazione
  saveNewBooking(): void {
    if (!this.newBooking.userName) {
      this.showAlertUser = true
      setTimeout(() => (this.showAlertUser = false), 3000)
      return
    }
    if (!this.newBooking.userEmail) {
      this.showAlertEmail = true
      setTimeout(() => (this.showAlertEmail = false), 3000)
      return
    }
    if (!this.newBooking.type) {
      this.showAlertType = true
      setTimeout(() => (this.showAlertType = false), 3000)
      return
    }
    if (!this.newBooking.floor) {
      this.showAlertFloor = true
      setTimeout(() => (this.showAlertFloor = false), 3000)
      return
    }
    if (!this.newBooking.workspace) {
      this.showAlertWorkspace = true
      setTimeout(() => (this.showAlertWorkspace = false), 3000)
      return
    }

    // Se è una prenotazione giornata intera, imposta l'orario fisso
    if (this.newBooking.type.includes("Giornata intera")) {
      this.newBooking.time = "8 - 18"
    }

    if (this.applyToAllDates && this.selectedDates.length > 1) {
      // Crea una prenotazione per ogni data selezionata
      this.selectedDates.forEach((date, index) => {
        if (!this.isWeekend(date)) {
          const booking = { ...this.newBooking }
          booking.id = this.allBookings.length + index + 1
          booking.date = new Date(date)
          this.allBookings.push(booking)
        }
      })
    } else {
      // Aggiungi solo la prenotazione per la data selezionata
      this.newBooking.id = this.allBookings.length + 1
      this.allBookings.push({ ...this.newBooking })
    }

    // Chiudi la modalità e aggiorna la vista
    this.closeAddBookingModal()
    this.filterBookingsByDates()
    this.generateCalendar() // Aggiorna il conteggio delle prenotazioni nel calendario

    // TODO: Implementare la chiamata al backend per salvare la nuova prenotazione
  }

  // Genera dati di esempio per le prenotazioni
  generateMockBookings(): void {
    const users = [
      { id: "U001", name: "Marco Bianchi", email: "marco.bianchi@azienda.it" },
      { id: "U002", name: "Laura Verdi", email: "laura.verdi@azienda.it" },
      { id: "U003", name: "Alessandro Rossi", email: "alessandro.rossi@azienda.it" },
      { id: "U004", name: "Giulia Neri", email: "giulia.neri@azienda.it" },
      { id: "U005", name: "Luca Ferrari", email: "luca.ferrari@azienda.it" },
    ]

    // Genera prenotazioni per gli ultimi 30 giorni
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      // Salta i weekend
      if (this.isWeekend(date)) continue

      // Genera un numero casuale di prenotazioni per questa data (tra 0 e 5)
      const bookingsCount = Math.floor(Math.random() * 6)

      for (let j = 0; j < bookingsCount; j++) {
        const user = users[Math.floor(Math.random() * users.length)]
        const type = this.typeOptions[Math.floor(Math.random() * this.typeOptions.length)]
        const time = type.includes("Giornata intera") ? "8 - 18" : `${Math.floor(Math.random() * 11) + 8}:00`

        const booking: Booking = {
          id: this.allBookings.length + 1,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          date: new Date(date),
          time: time,
          location: "Roma (Bufalotta)",
          floor: this.floorOptions[Math.floor(Math.random() * this.floorOptions.length)],
          type: type,
          workspace: this.workspaceOptions[Math.floor(Math.random() * this.workspaceOptions.length)].workspace,
        }

        this.allBookings.push(booking)
      }
    }
  }

  // Metodo per aggiornare l'orario in caso di prenotazione giornata intera
  updateTimeForFullDay(): void {
    if (this.newBooking.type.includes("Giornata intera")) {
      this.newBooking.time = "8 - 18" // Imposta l'orario fisso per le prenotazioni giornata intera
    } else {
      this.newBooking.time = "" // Resetta l'orario se non è una prenotazione giornata intera
    }
  }

  // Metodo per aggiornare l'orario in caso di prenotazione giornata intera (per modifica)
  updateTimeForFullDayEdit(): void {
    if (this.currentBooking && this.currentBooking.type.includes("Giornata intera")) {
      this.currentBooking.time = "8 - 18" // Imposta l'orario fisso per le prenotazioni giornata intera
    }
  }

  // Ottieni la classe di disponibilità in base al numero di prenotazioni
  getAvailabilityClass(date: Date): string {
    if (this.isWeekend(date)) return ""

    const availableCount = this.getAvailableCount(date)
    const availabilityPercentage = (availableCount / this.totalWorkspaces) * 100

    if (availabilityPercentage > 70) return "high-availability"
    else if (availabilityPercentage > 30) return "medium-availability"
    else return "low-availability"
  }

  // Ottieni il testo di disponibilità per una data
  getAvailabilityText(date: Date): string {
    if (this.isWeekend(date)) return ""

    const availableCount = this.getAvailableCount(date)
    const availabilityPercentage = (availableCount / this.totalWorkspaces) * 100

    if (availabilityPercentage > 70) return `${availableCount} libere`
    else if (availabilityPercentage > 30) return `${availableCount} libere`
    else return `${availableCount} libere`
  }

  // Ottieni il numero di postazioni disponibili per una data
  getAvailableCount(date: Date): number {
    if (this.isWeekend(date)) return 0

    const dateString = date.toDateString()
    const availability = this.dateAvailabilities.find((a) => a.date === dateString)

    if (availability) {
      return availability.availableCount
    }

    // Se non c'è una disponibilità memorizzata, genera una nuova
    const day = date.getDay()
    let availableCount = 0

    if (day === 2 || day === 4) {
      // Martedì e giovedì: meno disponibilità (20-40%)
      availableCount = Math.floor(this.totalWorkspaces * (0.2 + Math.random() * 0.2))
    } else {
      // Altri giorni: più disponibilità (40-80%)
      availableCount = Math.floor(this.totalWorkspaces * (0.4 + Math.random() * 0.4))
    }

    // Memorizza la disponibilità
    this.dateAvailabilities.push({
      date: dateString,
      availableCount,
      totalCount: this.totalWorkspaces,
    })

    return availableCount
  }

  // Aggiungo il metodo per scaricare il file Excel
  downloadExcel(): void {
    // Prepara i dati per l'export
    const bookingsToExport = this.selectedDates.length > 0 ? this.filteredBookings : this.allBookings

    // Crea l'intestazione del CSV
    let csvContent = "ID,Nome Utente,Email,Data,Orario,Sede,Piano,Tipo,Postazione\n"

    // Aggiungi i dati delle prenotazioni
    bookingsToExport.forEach((booking) => {
      const formattedDate = new Date(booking.date).toLocaleDateString("it-IT")
      const row = [
        booking.id,
        booking.userName,
        booking.userEmail,
        formattedDate,
        booking.time,
        booking.location,
        booking.floor,
        booking.type,
        booking.workspace,
      ]
        .map((value) => `"${value}"`)
        .join(",")

      csvContent += row + "\n"
    })

    // Crea un Blob con i dati CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Crea un URL per il Blob
    const url = window.URL.createObjectURL(blob)

    // Crea un elemento <a> per scaricare il file
    const link = document.createElement("a")
    link.href = url

    // Nome del file
    const today = new Date().toISOString().slice(0, 10)
    link.download = `prenotazioni_${today}.csv`

    // Aggiungi l'elemento al DOM, clicca e rimuovilo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Libera l'URL creato
    window.URL.revokeObjectURL(url)

    // Mostra un messaggio di conferma
    alert(`File esportato con successo: prenotazioni_${today}.csv`)
  }
}

