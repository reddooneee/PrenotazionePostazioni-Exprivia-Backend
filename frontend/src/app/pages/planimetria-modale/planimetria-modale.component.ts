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

    //Sala Gastone
    { id: "1", x: 33.1, y: 26.2 },

    //Sala Leonardo
    { id: "2", x: 14.25, y: 30.7 },

    //Stanza A16
    { id: "3", x: 43.8, y: 24.6 },
    { id: "4", x: 46.4, y: 21.5 },
    { id: "5", x: 46.4, y: 28.5 },

    

    //Stanza A20
    { id: "11", x: 40.2, y: 62.6 },
    { id: "12", x: 40.3, y: 58.4 },
    { id: "13", x: 42, y: 58.7 },
    { id: "14", x: 41.8, y: 62.5 },



    //Stanza A22
    { id: "20", x: 31.3, y: 65.8 },
    { id: "21", x: 31.3, y: 59.8 },
    { id: "22", x: 34.7, y: 60.4 },
    { id: "23", x: 34.3, y: 64.0 },


    //Stanza A3.A
    { id: "36", x: 2.25, y: 56.3 },



    //Stanza A6
    { id: "43", x: 2.25, y: 29.6 },
    { id: "44", x: 2.25, y: 32.9 },
    { id: "45", x: 5.25, y: 34.7 },


  

    //Stanza A8
    { id: "49", x: 2.25, y: 12.5 },
    { id: "50", x: 2.25, y: 15.5 },
    { id: "51", x: 5.25, y: 13.0 },

    //stanza A9
    { id: "52", x: 2.25, y: 4.6 },
    { id: "53", x: 6.26, y: 3.9 },
    { id: "54", x: 6.25, y: 7.4},
    { id: "55", x: 2.25, y: 7.6 },

    //Stanza A10
    { id: "56", x: 11.3, y: 5 },
    { id: "57", x: 13.40, y: 5 },
    { id: "58", x: 11.3, y: 11 },

    

    //Sala Riunioni Keplero
    { id: "61", x: 19.9, y: 80.9 },

    

    //Stanza A31
    { id: "66", x: 20.8, y: 37.5 },
    { id: "67", x: 22.3, y: 43.2 },
    { id: "68", x: 22.2, y: 48.8 },


   

    //Stanza A26
    { id: "24", x: 11.8, y: 62.7 },
    { id: "25", x: 14.2, y: 62.7 },
    { id: "26", x: 16.7, y: 62.7 },
    { id: "27", x: 16.5, y: 68.7 },
    { id: "28", x: 14.14, y: 68.7 },
    { id: "29", x: 11.6, y: 68.7 },
]


  // Mappa delle stanze e relative postazioni
  private mappaStanzePostazioni: { [key: string]: string[] } = {
    "Stanza A10": ["A10 - Postazione 56", "A10 - Postazione 57", "A10 - Postazione 58"],
    "Stanza A16": ["A16 - Postazione 3", "A16 - Postazione 4", "A16 - Postazione 5"],
    "Stanza A22": ["A22 - Postazione 20", "A22 - Postazione 21", "A22 - Postazione 22", "A22 - Postazione 23"],
    "Stanza A6": ["A6 - Postazione 43", "A6 - Postazione 44", "A6 - Postazione 45"],
    "Stanza A3.A": ["A3.A - Postazione 36"],
    "Stanza A26": [
      "A26 - Postazione 24",
      "A26 - Postazione 25",
      "A26 - Postazione 26",
      "A26 - Postazione 27",
      "A26 - Postazione 28",
      "A26 - Postazione 29",
    ],
    "Stanza A31": ["A31 - Postazione 66", "A31 - Postazione 67", "A31 - Postazione 68"],
    "Stanza A8": ["A8 - Postazione 49", "A8 - Postazione 50", "A8 - Postazione 51"],
    "Stanza A20": [ "A20 - Postazione 11", "A20 - Postazione 12", "A20 - Postazione 13", "A20 - Postazione 14"],
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
    "A26 - Postazione 24": "24",
    "A26 - Postazione 25": "25",
    "A26 - Postazione 26": "26",
    "A26 - Postazione 27": "27",
    "A26 - Postazione 28": "28",
    "A26 - Postazione 29": "29",
    "A31 - Postazione 66": "66",
    "A31 - Postazione 67": "67",
    "A31 - Postazione 68": "68",
    "A8 - Postazione 49": "49",
    "A8 - Postazione 50": "50",
    "A8 - Postazione 51": "51",
    "A20 - Postazione 11": "11",
    "A20 - Postazione 12": "12",
    "A20 - Postazione 13": "13",
    "A20 - Postazione 14": "14",
    "A9 - Postazione 52": "52",
    "A9 - Postazione 53": "53",
    "A9 - Postazione 54": "54",
    "A9 - Postazione 55": "55",
    "Sala Gastone": "1",
    "Sala Keplero": "61",
    "Sala Leonardo": "2",
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
