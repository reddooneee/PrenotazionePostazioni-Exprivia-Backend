import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

interface MarkerPosition {
  id: string
  label: string
  tooltip: string
  x: number
  y: number
  available: boolean
  selected: boolean
}

@Component({
  selector: "app-planimetria-modale",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./planimetria-modale.component.html",
  styleUrls: ["./planimetria-modale.component.css"],
})
export class PlanimetriaModaleComponent implements OnInit {
  @Input() stanzaSelezionata = ""
  @Input() postazioniDisponibili: string[] = []
  @Output() chiudi = new EventEmitter<void>()
  @Output() selezionePostazione = new EventEmitter<{ stanza: string; postazione: string }>()

  markers: MarkerPosition[] = []
  selectedMarkerId: string | null = null

  // Coordinate delle postazioni
  private coordinatePostazioni: { id: string; x: number; y: number }[] = [
    { id: "34", x: 8.25, y: 68.7 },
    { id: "31", x: 18.5, y: 78.9 },
    { id: "32", x: 14.3, y: 77.0 },
    { id: "33", x: 8.25, y: 67.6 },
    { id: "35", x: 11.5, y: 67.6 },
    { id: "38", x: 11.3, y: 62.6 },
    { id: "36", x: 8.25, y: 62.6 },
    { id: "37", x: 8.25, y: 63.6 },
    { id: "40", x: 8.28, y: 58.8 },
    { id: "39", x: 8.25, y: 57.7 },
    { id: "42", x: 8.28, y: 53.9 },
    { id: "41", x: 8.32, y: 52.8 },
    { id: "44", x: 8.28, y: 48.7 },
    { id: "43", x: 8.28, y: 47.6 },
    { id: "45", x: 11.1, y: 49.8 },
    { id: "47", x: 8.25, y: 44.1 },
    { id: "46", x: 8.28, y: 43.0 },
    { id: "48", x: 10.9, y: 42.6 },
    { id: "50", x: 8.25, y: 39.0 },
    { id: "49", x: 8.28, y: 37.9 },
    { id: "54", x: 11.7, y: 34.2 },
    { id: "53", x: 11.7, y: 32.6 },
    { id: "55", x: 8.25, y: 34.3 },
    { id: "56", x: 17.0, y: 32.7 },
    { id: "57", x: 18.2, y: 32.7 },
    { id: "58", x: 16.9, y: 36.0 },
    { id: "60", x: 22.1, y: 36.4 },
    { id: "61", x: 32.8, y: 34.0 },
    { id: "62", x: 36.2, y: 32.7 },
    { id: "63", x: 38.1, y: 32.7 },
    { id: "64", x: 38.1, y: 36.4 },
    { id: "65", x: 41.0, y: 31.7 },
    { id: "1", x: 44.5, y: 33.0 },
    { id: "2", x: 44.5, y: 37.1 },
    { id: "3", x: 48.1, y: 44.3 },
    { id: "4", x: 50.6, y: 42.5 },
    { id: "5", x: 50.6, y: 46.5 },
    { id: "12", x: 45.0, y: 63.4 },
    { id: "11", x: 45.1, y: 65.9 },
    { id: "13", x: 46.0, y: 63.4 },
    { id: "14", x: 46.0, y: 65.9 },
    { id: "19", x: 45.9, y: 74.0 },
    { id: "21", x: 36.0, y: 64.5 },
    { id: "23", x: 38.7, y: 66.8 },
    { id: "20", x: 36.0, y: 68.1 },
    { id: "22", x: 39.3, y: 64.5 },
    { id: "15", x: 53.9, y: 63.4 },
    { id: "16", x: 54.9, y: 63.4 },
    { id: "18", x: 58.7, y: 63.8 },
    { id: "66", x: 25.8, y: 51.7 },
    { id: "67", x: 27.2, y: 55.4 },
    { id: "69", x: 31.8, y: 51.7 },
    { id: "70", x: 32.8, y: 51.7 },
    { id: "74", x: 30.5, y: 56.9 },
    { id: "73", x: 29.9, y: 58.6 },
    { id: "71", x: 32.9, y: 56.9 },
    { id: "72", x: 33.5, y: 58.6 },
    { id: "24", x: 17.7, y: 67.1 },
    { id: "25", x: 19.6, y: 67.1 },
    { id: "26", x: 21.6, y: 67.1 },
    { id: "29", x: 17.7, y: 68.1 },
    { id: "28", x: 19.6, y: 68.1 },
    { id: "27", x: 21.6, y: 68.2 },
    { id: "17", x: 54.4, y: 65.2 },
    { id: "30", x: 18.5, y: 74.5 },
    { id: "6", x: 54.2, y: 46.8 },
    { id: "7", x: 54.2, y: 44.5 },
    { id: "8", x: 54.2, y: 42.6 },
    { id: "9", x: 55.3, y: 42.6 },
    { id: "10", x: 55.1, y: 46.8 },
    { id: "51", x: 11.0, y: 37.3 },
    { id: "52", x: 8.25, y: 32.6 },
    { id: "59", x: 22.1, y: 32.7 },
    { id: "68", x: 27.2, y: 57.8 },
  ]

  // Mappa delle stanze e relative postazioni
  private mappaStanzePostazioni: { [key: string]: string[] } = {
    "Stanza A10": ["A10 - Postazione 56", "A10 - Postazione 57", "A10 - Postazione 58"],
    "Stanza A16": ["A16 - Postazione 3", "A16 - Postazione 4", "A16 - Postazione 5"],
    "Stanza A22": ["A22 - Postazione 20", "A22 - Postazione 21", "A22 - Postazione 22", "A22 - Postazione 23"],
    "Stanza A6": ["A6 - Postazione 43", "A6 - Postazione 44", "A6 - Postazione 45"],
    "Stanza A3.A": ["A3.A - Postazione 36"],
    "Stanza A26": [
      "A26 - Postazione 75",
      "A26 - Postazione 76",
      "A26 - Postazione 77",
      "A26 - Postazione 78",
      "A26 - Postazione 79",
      "A26 - Postazione 80",
    ],
    "Stanza A31": ["A31 - Postazione 66", "A31 - Postazione 67", "A31 - Postazione 68"],
    "Stanza A8": ["A8 - Postazione 49", "A8 - Postazione 50", "A8 - Postazione 51"],
    "Stanza A20": ["A20 - Postazione 10", "A20 - Postazione 11", "A20 - Postazione 12", "A20 - Postazione 13"],
    "Stanza A9": ["A9 - Postazione 52", "A9 - Postazione 53", "A9 - Postazione 54", "A9 - Postazione 55"],
    "Sala Riunioni Gastone (8 Postazioni)": ["Sala Gastone"],
    "Sala Riunioni Keplero (12 Postazioni)": ["Sala Keplero"],
    "Sala Riunioni Leonardo (7 Postazioni)": ["Sala Leonardo"],
  }

  // Mappa delle postazioni ai numeri di marker
  private mappaPostazioniMarker: { [key: string]: string } = {
    "A10 - Postazione 56": "56",
    "A10 - Postazione 57": "57",
    "A10 - Postazione 58": "58",
    "A16 - Postazione 3": "3",
    "A16 - Postazione 4": "4",
    "A16 - Postazione 5": "5",
    "A22 - Postazione 20": "20",
    "A22 - Postazione 21": "21",
    "A22 - Postazione 22": "22",
    "A22 - Postazione 23": "23",
    "A6 - Postazione 43": "43",
    "A6 - Postazione 44": "44",
    "A6 - Postazione 45": "45",
    "A3.A - Postazione 36": "36",
    "A26 - Postazione 75": "75",
    "A26 - Postazione 76": "76",
    "A26 - Postazione 77": "77",
    "A26 - Postazione 78": "78",
    "A26 - Postazione 79": "79",
    "A26 - Postazione 80": "80",
    "A31 - Postazione 66": "66",
    "A31 - Postazione 67": "67",
    "A31 - Postazione 68": "68",
    "A8 - Postazione 49": "49",
    "A8 - Postazione 50": "50",
    "A8 - Postazione 51": "51",
    "A20 - Postazione 10": "10",
    "A20 - Postazione 11": "11",
    "A20 - Postazione 12": "12",
    "A20 - Postazione 13": "13",
    "A9 - Postazione 52": "52",
    "A9 - Postazione 53": "53",
    "A9 - Postazione 54": "54",
    "A9 - Postazione 55": "55",
    "Sala Gastone": "1",
    "Sala Keplero": "61",
    "Sala Leonardo": "3",
  }

  // Mappa inversa per trovare la postazione dal numero del marker
  private mappaMarkerPostazioni: { [key: string]: string } = {}

  ngOnInit(): void {
    // Inizializza la mappa inversa
    for (const [postazione, marker] of Object.entries(this.mappaPostazioniMarker)) {
      this.mappaMarkerPostazioni[marker] = postazione
    }

    this.caricaMarkers()

    // Aggiungiamo un listener per gestire il tasto ESC
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.chiudiModale()
      }
    })
  }

  caricaMarkers(): void {
    this.markers = []

    // Se non c'è una stanza selezionata, mostra tutti i marker
    if (!this.stanzaSelezionata) {
      this.coordinatePostazioni.forEach((coord) => {
        this.markers.push({
          id: coord.id,
          label: coord.id,
          tooltip: `Marker ${coord.id}`,
          x: coord.x,
          y: coord.y,
          available: false,
          selected: false,
        })
      })
      return
    }

    // Ottieni le postazioni per la stanza selezionata
    const postazioniStanza = this.mappaStanzePostazioni[this.stanzaSelezionata] || []

    // Crea i marker
    this.coordinatePostazioni.forEach((coord) => {
      // Verifica se esiste una postazione associata a questo marker nella stanza selezionata
      const postazioneAssociata = this.mappaMarkerPostazioni[coord.id]
      if (postazioneAssociata && postazioniStanza.includes(postazioneAssociata)) {
        // Verifica se la postazione è disponibile
        const isAvailable = this.postazioniDisponibili.includes(postazioneAssociata)

        this.markers.push({
          id: coord.id,
          label: coord.id,
          tooltip: postazioneAssociata,
          x: coord.x,
          y: coord.y,
          available: isAvailable,
          selected: false,
        })
      }
    })
  }

  selezionaMarker(marker: MarkerPosition): void {
    if (!marker.available) return

    // Deseleziona tutti i marker
    this.markers.forEach((m) => (m.selected = false))

    // Seleziona il marker corrente
    marker.selected = true
    this.selectedMarkerId = marker.id

    // Trova la postazione corrispondente al marker
    const postazioneSelezionata = this.mappaMarkerPostazioni[marker.id]

    if (postazioneSelezionata && this.postazioniDisponibili.includes(postazioneSelezionata)) {
      // Emetti l'evento di selezione postazione
      setTimeout(() => {
        this.selezionePostazione.emit({
          stanza: this.stanzaSelezionata,
          postazione: postazioneSelezionata,
        })
      }, 300)
    }
  }

  chiudiModale(): void {
    this.chiudi.emit()
  }
}
