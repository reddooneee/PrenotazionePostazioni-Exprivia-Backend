import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Output,

} from "@angular/core";
import {  ReactiveFormsModule } from "@angular/forms";
import {
  MatCard,
  MatCardContent,
} from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { LucideAngularModule } from "lucide-angular";

interface Location {
  id: string;
  name: string;
  address: string;
  desks: number;
  meetingRooms: number;
  image: string;
}

@Component({
  selector: "app-location-selector",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Aggiunto per FormControl
    MatInputModule, // Aggiunto per input Material
    MatCard,
    MatCardContent,
    LucideAngularModule,
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  @Output() selectLocation = new EventEmitter<Location>()

  searchQuery = ""

  locations: Location[] = [
    {
      id: "lecce",
      name: "Exprivia – Lecce",
      address:
        "Campus Ecotekne, c/o Edificio Dhitech, Via Monteroni 165, 73100 Lecce",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "matera",
      name: "Exprivia – Matera",
      address: "c/o Digimat SpA, Via Giovanni Agnelli snc, 75100 Matera",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "milan_valtorta",
      name: "Exprivia – Milano",
      address: "Via dei Valtorta 43, 20127 Milano",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "molfetta_olivetti",
      name: "Exprivia – Molfetta",
      address: "Via A. Olivetti, 11, 70056 Molfetta",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "molfetta_agnelli",
      name: "Exprivia – Molfetta",
      address: "Via Giovanni Agnelli 5, 70056 Molfetta (BA)",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "palermo",
      name: "Exprivia – Palermo",
      address: "Viale Regione Siciliana Nord-Ovest 7275, 90146 Palermo",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "roma_bufalotta",
      name: "Exprivia – Roma",
      address: "Via della Bufalotta 378, 00139 Roma",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "trento",
      name: "Exprivia – Trento",
      address: "Palazzo Stella, Via Alcide Degasperi, 77, 38123 Trento",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "vicenza",
      name: "Exprivia – Vicenza",
      address: "Via L. Lazzaro Zamenhof 817, 36100 Vicenza",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "q",
      name: "Exprivia – Vicenza",
      address: "Via L. Lazzaro Zamenhof 817, 36100 Vicenza",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "w",
      name: "Exprivia – Vicenza",
      address: "Via L. Lazzaro Zamenhof 817, 36100 Vicenza",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "4",
      name: "Exprivia – Vicenza",
      address: "Via L. Lazzaro Zamenhof 817, 36100 Vicenza",
      desks: 0,
      meetingRooms: 0,
      image: "/placeholder.svg?height=120&width=300",
    },
  ];

  get filteredLocations(): Location[] {
    return this.locations.filter(
      (location) =>
        location.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(this.searchQuery.toLowerCase()),
    )
  }

  onSelect(location: Location): void {
    this.selectLocation.emit(location)
  }
}
