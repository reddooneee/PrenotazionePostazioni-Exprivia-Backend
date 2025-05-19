import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { RouterModule } from "@angular/router";
import { authAnimations } from "../../../shared/animations/auth.animations";

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
    selector: "app-feature-card",
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
      class="group relative flex flex-col items-center text-center p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl"
      [class]="getCardClasses()"
      [@scaleIn]
    >
      <!-- Hover Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        [class]="getHoverEffectClasses()"
      ></div>

      <!-- Icon Container -->
      <div
        class="relative w-16 h-16 flex items-center justify-center rounded-2xl mb-6 transition-colors duration-300"
        [class]="getIconContainerClasses()"
      >
        <mat-icon
          [class]="getIconClasses()"
          class="transform group-hover:scale-110 transition-transform duration-300"
        >
          {{ config.icon }}
        </mat-icon>
      </div>

      <!-- Content -->
      <div class="relative">
        <h3
          class="text-2xl font-semibold mb-3 transition-colors duration-300"
          [class]="getTitleClasses()"
        >
          {{ config.title }}
        </h3>
        <p class="text-gray-200 mb-6">{{ config.description }}</p>

        <!-- Feature List -->
        <ul *ngIf="config.features?.length" class="text-left space-y-2 mb-6">
          <li
            *ngFor="let feature of config.features"
            class="flex items-center text-gray-300"
          >
            <mat-icon class="text-expriviaOrange400 mr-2"
              >check_circle</mat-icon
            >
            {{ feature }}
          </li>
        </ul>

        <!-- Learn More Link -->
        <a
          *ngIf="config.linkText && config.linkUrl"
          [routerLink]="config.linkUrl"
          class="inline-flex items-center text-expriviaOrange400 hover:text-expriviaOrange transition-colors duration-300"
        >
          {{ config.linkText }}
          <mat-icon
            class="ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
          >
            arrow_forward
          </mat-icon>
        </a>
      </div>
    </div>
  `,
    animations: [authAnimations.scaleIn],
})
export class FeatureCardComponent {
    @Input() config!: FeatureCardConfig;

    getCardClasses(): string {
        return `
      ${this.config.backgroundColor || "bg-expriviaBlue/80"}
      ${this.config.borderColor || "border-expriviaOrange400/20 hover:border-expriviaOrange400/40"}
    `;
    }

    getHoverEffectClasses(): string {
        return `from-expriviaOrange/10 to-expriviaBlue/5`;
    }

    getIconContainerClasses(): string {
        return `bg-expriviaOrange/10 group-hover:bg-expriviaOrange/20`;
    }

    getIconClasses(): string {
        return `text-expriviaOrange400 w-8 h-8`;
    }

    getTitleClasses(): string {
        return `text-white group-hover:text-expriviaOrange400`;
    }
}
