// import { Component, OnInit } from '@angular/core';
// import { Desk } from '../../../model/desk.model';
// import { User } from '../../../model/user.model';
// import { AuthService } from '../../service/auth.service';
// import { DeskService } from '../../service/desk.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-booking',
//   templateUrl: './booking.component.html',
//   styleUrls: ['./booking.component.scss'],
//   imports: [CommonModule]
// })
// export class BookingComponent implements OnInit {
//   desks: Desk[] = [];
//   currentUser: User | null = null;
//   isLoading = true;
//   selectedDesk: Desk | null = null;
//   showConfirmationModal = false;
//   bookingSuccess = false;
//   bookingMessage = '';

//   constructor(
//     private deskService: DeskService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.authService.getCurrentUser();
//     this.loadDesks();
//   }

//   /**
//    * Load available desks from the service
//    */
//   loadDesks(): void {
//     this.isLoading = true;
    
//     this.deskService.getDesks().subscribe({
//       next: (desks) => {
//         this.desks = desks;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading desks:', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   /**
//    * Open confirmation modal for booking a desk
//    */
//   openBookingConfirmation(desk: Desk): void {
//     this.selectedDesk = desk;
//     this.showConfirmationModal = true;
//   }

//   /**
//    * Close confirmation modal
//    */
//   closeConfirmationModal(): void {
//     this.showConfirmationModal = false;
//     this.selectedDesk = null;
//   }

//   /**
//    * Confirm desk booking
//    */
//   confirmBooking(): void {
//     if (!this.selectedDesk) {
//       return;
//     }

//     this.deskService.bookDesk(this.selectedDesk.id).subscribe({
//       next: (updatedDesk) => {
//         // Update desk in the list
//         this.desks = this.desks.map(desk => 
//           desk.id === updatedDesk.id ? updatedDesk : desk
//         );
        
//         this.bookingSuccess = true;
//         this.bookingMessage = `You have successfully booked ${updatedDesk.name}.`;
        
//         // Close modal after 2 seconds
//         setTimeout(() => {
//           this.closeConfirmationModal();
//           this.bookingSuccess = false;
//           this.bookingMessage = '';
//         }, 2000);
//       },
//       error: (error) => {
//         console.error('Error booking desk:', error);
//         this.bookingSuccess = false;
//         this.bookingMessage = 'Failed to book desk. Please try again.';
//       }
//     });
//   }
// }