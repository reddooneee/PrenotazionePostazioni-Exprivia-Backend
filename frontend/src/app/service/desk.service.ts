import { Observable, of } from "rxjs";
import { Desk } from "../../model/desk.model";

export class DeskService {
    // Mock data for available desks
    private desks: Desk[] = [
        { id: '1', name: 'Desk A1', isAvailable: true },
        { id: '2', name: 'Desk A2', isAvailable: true },
        { id: '3', name: 'Desk B1', isAvailable: true },
        { id: '4', name: 'Desk B2', isAvailable: true },
        { id: '5', name: 'Desk C1', isAvailable: true },
        { id: '6', name: 'Desk C2', isAvailable: true },
    ];

    /**
     * Gets all available desks
     */
    getDesks(): Observable<Desk[]> {
        return of(this.desks);
    }

    /**
     * Books a desk by ID
     */
    bookDesk(deskId: string): Observable<Desk> {
        const deskIndex = this.desks.findIndex(desk => desk.id === deskId);

        if (deskIndex !== -1) {
            this.desks[deskIndex] = {
                ...this.desks[deskIndex],
                isAvailable: false
            };

            return of(this.desks[deskIndex]);
        }

        throw new Error('Desk not found');
    }

    /**
     * Releases a booked desk
     */
    releaseDesk(deskId: string): Observable<Desk> {
        const deskIndex = this.desks.findIndex(desk => desk.id === deskId);

        if (deskIndex !== -1) {
            this.desks[deskIndex] = {
                ...this.desks[deskIndex],
                isAvailable: true
            };

            return of(this.desks[deskIndex]);
        }

        throw new Error('Desk not found');
    }
}