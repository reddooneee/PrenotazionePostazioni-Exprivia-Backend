export class DateUtils {
    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    static formatDateTime(date: Date): string {
        return date.toISOString();
    }

    static parseDate(dateStr: string): Date {
        return new Date(dateStr);
    }

    static isValidDate(dateStr: string): boolean {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date.getTime());
    }

    static isFutureDate(dateStr: string): boolean {
        const date = new Date(dateStr);
        const now = new Date();
        return date > now;
    }

    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static getWeekDates(date: Date): Date[] {
        const week: Date[] = [];
        const current = new Date(date);
        current.setDate(current.getDate() - current.getDay());
        
        for (let i = 0; i < 7; i++) {
            week.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        
        return week;
    }

    static getTimeSlots(startHour: number = 9, endHour: number = 18, intervalMinutes: number = 30): string[] {
        const slots: string[] = [];
        const current = new Date();
        current.setHours(startHour, 0, 0);
        
        while (current.getHours() < endHour) {
            slots.push(current.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
            current.setMinutes(current.getMinutes() + intervalMinutes);
        }
        
        return slots;
    }
} 