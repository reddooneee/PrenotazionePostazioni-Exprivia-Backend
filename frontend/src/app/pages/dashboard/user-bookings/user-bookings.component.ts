import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/auth/user.model';
import { CommonModule, DatePipe } from '@angular/common';

interface Booking {
  id: number;
  date: Date;
  workstation: string;
  status: string;
}

@Component({
  selector: 'app-user-bookings',
  template: `
    <div class="container mt-4">
      <h2>Le Mie Prenotazioni</h2>
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Prenotazioni Attive</h5>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Postazione</th>
                      <th>Stato</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let booking of bookings">
                      <td>{{booking.date | date:'dd/MM/yyyy'}}</td>
                      <td>{{booking.workstation}}</td>
                      <td>{{booking.status}}</td>
                      <td>
                        <button class="btn btn-sm btn-danger" (click)="cancelBooking(booking.id)">Annulla</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table {
      margin-top: 20px;
    }
    .btn-sm {
      margin-right: 5px;
    }
  `],
  standalone: true,
  imports: [CommonModule, DatePipe]
})
export class UserBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getIdentity().subscribe(user => {
      this.currentUser = user;
      this.loadBookings();
    });
  }

  loadBookings() {
    // TODO: Implement booking service and load user's bookings
    console.log('Loading bookings for user:', this.currentUser?.email);
  }

  cancelBooking(bookingId: number) {
    if (confirm('Sei sicuro di voler annullare questa prenotazione?')) {
      // TODO: Implement booking cancellation
      console.log('Cancelling booking:', bookingId);
    }
  }
} 