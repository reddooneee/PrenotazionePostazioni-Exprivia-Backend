import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { authAnimations } from '../../../shared/animations/auth.animations';

export interface FeatureCardConfig {
    title: string;
    description: string;
    icon: string;
    features?: string[];
    linkText?: string;
    linkUrl?: string;
    iconColor?: string;
    backgroundColor?: string;
    borderColor?: string;
}

@Component({
    selector: 'app-feature-card',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        RouterModule,
    ],
    template: `
       <div
            class="group relative flex flex-col items-center text-center p-8 rounded-[var(--radius-2xl)] bg-white border border-gray-200 transition-[var(--transition-all)] hover:shadow-lg hover:border-expriviaOrange/40"
            [@scaleIn]
        >
            <!-- Glassmorphism Effect -->
            <div
                class="absolute inset-0 bg-white/5 backdrop-blur-md rounded-[var(--radius-2xl)] border border-white/10"
                aria-hidden="true"
            ></div>

            <!-- Hover Effect -->
            <div
                class="absolute inset-0 bg-gradient-to-br from-expriviaOrange/5 to-expriviaBlue/5 opacity-0 group-hover:opacity-100 transition-[var(--transition-opacity)] rounded-[var(--radius-2xl)]"
                aria-hidden="true"
            ></div>

            <!-- Content Container -->
            <div class="relative z-10 w-full">
                <!-- Icon Container -->
                <div
                    class="relative w-16 h-16 flex items-center justify-center rounded-[var(--radius-xl)] mb-6 mx-auto transition-[var(--transition-colors)]"
                    [class]="getIconContainerClasses()"
                >
                    <mat-icon
                        [class]="getIconClasses()"
                        class="transform group-hover:scale-110 transition-[var(--transition-transform)] drop-shadow-md"
                        aria-hidden="true"
                    >
                        {{ config.icon }}
                    </mat-icon>
                </div>

                <!-- Text Content -->
                <!-- Text Content -->
                <div>
                    <h3
                        class="text-2xl font-semibold mb-3 text-gray-800 transition-[var(--transition-colors)] group-hover:text-expriviaOrange"
                    >
                        {{ config.title }}
                    </h3>
                    <p class="text-gray-600 mb-6">{{ config.description }}</p>

                    <!-- Feature List -->
                    <ul *ngIf="config.features?.length" class="text-left space-y-2 mb-6">
                        <li
                            *ngFor="let feature of config.features"
                            class="flex items-center text-gray-700"
                        >
                            <mat-icon class="text-expriviaOrange mr-2 drop-shadow-sm" aria-hidden="true">
                                check_circle
                            </mat-icon>
                            {{ feature }}
                        </li>
                    </ul>

                    <!-- Learn More Link -->
                    <a
                        *ngIf="config.linkText && config.linkUrl"
                        [routerLink]="config.linkUrl"
                        class="inline-flex items-center text-expriviaOrange hover:text-expriviaOrange600 transition-[var(--transition-colors)] font-medium"
                       
                    >
                        {{ config.linkText }}
                        <mat-icon
                            class="ml-2 transform group-hover:translate-x-1 transition-[var(--transition-transform)]"
                            aria-hidden="true"
                        >
                            arrow_forward
                        </mat-icon>
                    </a>
                </div>
            </div>
        </div>
    `,
    animations: [authAnimations.scaleIn],
})
export class FeatureCardComponent {
    @Input() config!: FeatureCardConfig;

    getCardClasses(): string {
        return `
            ${this.config.backgroundColor || 'bg-expriviaBlue/90'}
            ${this.config.borderColor || 'border-white/20 hover:border-expriviaOrange/40'}
        `;
    }

    getHoverEffectClasses(): string {
        return 'from-expriviaOrange/10 to-expriviaBlue/5';
    }

   getIconContainerClasses(): string {
    return `bg-expriviaOrange/20 group-hover:bg-expriviaOrange/30 shadow-[inset_0_0_0_1px_rgba(233,80,14,0.3)] group-hover:shadow-[inset_0_0_0_1px_rgba(233,80,14,0.5)]`;
}

  getIconClasses(): string {
    return `text-expriviaOrange w-10 h-10 group-hover:text-expriviaOrange600`;
}
    getTitleClasses(): string {
        return 'text-white group-hover:text-expriviaOrange';
    }
}