import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { authAnimations } from '../../shared/animations/auth.animations';
import { FeatureCardComponent, FeatureCardConfig } from '../../shared/components/feature-card/feature-card.component';
import { ButtonComponent } from '../../shared/components/buttons/button.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        HeaderComponent,
        FeatureCardComponent,
        ButtonComponent
    ],
    templateUrl: './home.component.html',
    animations: [
        authAnimations.fadeIn,
        authAnimations.slideUp,
        authAnimations.scaleIn
    ]
})
export class HomeComponent {
    featureCards: FeatureCardConfig[] = [
        {
            title: 'Prenotazioni Facili',
            description: 'Prenota il tuo spazio di lavoro in pochi click, con un\'interfaccia intuitiva e veloce.',
            icon: 'calendar_today',
            features: [
                'Selezione rapida date e orari',
                'Visualizzazione in tempo reale'
            ],
            linkText: 'Scopri di più',
            linkUrl: '/prenotazioni'
        },
        {
            title: 'Gestione Flessibile',
            description: 'Modifica o cancella le tue prenotazioni in qualsiasi momento, con notifiche in tempo reale.',
            icon: 'schedule',
            features: [
                'Modifiche istantanee',
                'Notifiche push'
            ],
            linkText: 'Scopri di più',
            linkUrl: '/gestione'
        },
        {
            title: 'Collaborazione',
            description: 'Coordina facilmente le prenotazioni con il tuo team e gestisci gli spazi condivisi.',
            icon: 'group',
            features: [
                'Gestione team',
                'Spazi condivisi'
            ],
            linkText: 'Scopri di più',
            linkUrl: '/team'
        }
    ];
}
