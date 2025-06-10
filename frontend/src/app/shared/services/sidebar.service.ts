import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  
  constructor() {
    // Check window size on initialization
    this.checkWindowSize();
  }

  private checkWindowSize(): void {
    const COLLAPSE_WIDTH = 768;
    this.isCollapsedSubject.next(window.innerWidth < COLLAPSE_WIDTH);
  }

  get isCollapsed$(): Observable<boolean> {
    return this.isCollapsedSubject.asObservable();
  }

  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  toggleSidebar(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }

  setCollapsed(collapsed: boolean): void {
    this.isCollapsedSubject.next(collapsed);
  }

  updateForWindowResize(): void {
    this.checkWindowSize();
  }
} 