import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export type ButtonType = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'left' | 'right';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: ButtonType = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() icon?: string;
  @Input() iconPosition: IconPosition = 'left';
  @Input() disabled: boolean = false;
  @Input() routerLink?: string;
  @Input() fullWidth: boolean = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    const baseClasses = 'group cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    const typeClasses = {
      primary: 'bg-expriviaOrange text-white hover:bg-expriviaOrange600 focus:ring-expriviaOrange shadow-lg hover:shadow-xl',
      secondary: 'bg-expriviaBlue text-white hover:bg-expriviaBlue/90 focus:ring-expriviaBlue shadow-lg hover:shadow-xl',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-lg hover:shadow-xl',
      ghost: 'bg-transparent text-white border-2 border-expriviaOrange400/20 hover:border-expriviaOrange400/40 focus:ring-expriviaOrange400/20',
      link: 'bg-transparent text-white hover:text-expriviaOrange400 focus:ring-expriviaOrange'
    };
    const widthClass = this.fullWidth ? 'w-full' : '';
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return `${baseClasses} ${sizeClasses[this.size]} ${typeClasses[this.type]} ${widthClass} ${disabledClass}`;
  }

  getIconClasses(): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return `fas ${sizeClasses[this.size]} transition-transform duration-300 group-hover:translate-x-1`;
  }

  getTextClasses(): string {
    return this.size === 'sm' ? 'text-sm' : 'text-base font-medium';
  }

  getRippleColor(): string {
    const typeColors = {
      primary: 'rgba(255, 255, 255, 0.2)',
      secondary: 'rgba(255, 255, 255, 0.2)',
      danger: 'rgba(255, 255, 255, 0.2)',
      ghost: 'rgba(233, 80, 14, 0.1)',
      link: 'rgba(233, 80, 14, 0.1)'
    };
    return typeColors[this.type];
  }
} 