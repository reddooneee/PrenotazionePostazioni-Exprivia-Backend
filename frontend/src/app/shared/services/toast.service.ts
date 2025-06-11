import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  /**
   * Show a success toast message
   * @param summary - Brief title for the message
   * @param detail - Detailed message content
   * @param life - Auto-dismiss time in milliseconds (default: 5000ms)
   */
  showSuccess(summary: string, detail: string, life: number = 5000): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life
    });
  }

  /**
   * Show an error toast message
   * @param summary - Brief title for the message
   * @param detail - Detailed message content
   * @param life - Auto-dismiss time in milliseconds (default: 8000ms)
   */
  showError(summary: string, detail: string, life: number = 8000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life
    });
  }

  /**
   * Show an info toast message
   * @param summary - Brief title for the message
   * @param detail - Detailed message content
   * @param life - Auto-dismiss time in milliseconds (default: 6000ms)
   */
  showInfo(summary: string, detail: string, life: number = 6000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life
    });
  }

  /**
   * Show a warning toast message
   * @param summary - Brief title for the message
   * @param detail - Detailed message content
   * @param life - Auto-dismiss time in milliseconds (default: 7000ms)
   */
  showWarning(summary: string, detail: string, life: number = 7000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life
    });
  }

  /**
   * Clear all existing toasts
   */
  clearAll(): void {
    this.messageService.clear();
  }

  /**
   * Clear a specific toast by key
   * @param key - The key of the toast to clear
   */
  clear(key?: string): void {
    this.messageService.clear(key);
  }
} 