import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Gestione Utenti</h1>
      <div class="bg-white rounded-xl shadow p-6">
        <p class="text-slate-700">User management content goes here.</p>
      </div>
    </div>
  `
})
export class UserManagementComponent {} 