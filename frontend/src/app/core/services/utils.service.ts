import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor() {}

    /**
     * Converts an Observable to a Promise and handles the response
     * @param observable The Observable to convert
     * @returns Promise with the result
     */
    async fromObservable<T>(observable: Observable<T>): Promise<T> {
        try {
            return await firstValueFrom(observable);
        } catch (error) {
            console.error('Error converting Observable to Promise:', error);
            throw error;
        }
    }

    /**
     * Safely gets the length of an array, returning 0 for null or undefined
     * @param arr The array to check
     * @returns The length of the array or 0
     */
    getArrayLength<T>(arr: T[] | null | undefined): number {
        return arr?.length || 0;
    }

    /**
     * Safely filters an array, returning empty array for null or undefined
     * @param arr The array to filter
     * @param predicate The filter function
     * @returns Filtered array
     */
    filterArray<T>(arr: T[] | null | undefined, predicate: (value: T) => boolean): T[] {
        return arr?.filter(predicate) || [];
    }
} 