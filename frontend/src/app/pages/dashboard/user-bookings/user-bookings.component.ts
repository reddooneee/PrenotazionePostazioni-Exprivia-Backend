import { Component } from '@angular/core';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Le tue prenotazioni</h1>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-slate-700">User bookings content goes here.</p>
      </div>
    </div>
  `
})
export class UserBookingsComponent {} 