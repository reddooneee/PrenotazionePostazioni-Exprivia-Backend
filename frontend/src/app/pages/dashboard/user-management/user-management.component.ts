import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../core/auth/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  template: `
    <div class="container mx-auto px-4 py-8 animate-fade-in">
      <h2 class="text-3xl font-bold mb-8 text-gray-800">Gestione Utenti</h2>
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cognome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of users" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{user.id_user}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{user.nome}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{user.cognome}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{user.email}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="user.enabled ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'">
                    {{user.enabled ? 'Attivo' : 'Disattivo'}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                    (click)="editUser(user)">
                    Modifica
                  </button>
                  <button 
                    class="text-red-600 hover:text-red-900 transition-colors duration-200"
                    (click)="deleteUser(user.id_user || 0)">
                    Elimina
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.userService.getAllUsers();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  editUser(user: User) {
    // TODO: Implement edit functionality
    console.log('Edit user:', user);
  }

  async deleteUser(userId: number) {
    if (userId === 0) {
      console.error('Invalid user ID');
      return;
    }
    
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      try {
        await this.userService.deleteUser(userId);
        await this.loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }
} 