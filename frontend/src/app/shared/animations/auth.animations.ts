import { trigger, transition, style, animate, keyframes } from '@angular/animations';

export const authAnimations = {
  fadeIn: trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('0.5s ease-out', style({ opacity: 1 }))
    ])
  ]),

  slideUp: trigger('slideUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]),

  shake: trigger('shake', [
    transition(':enter', [
      animate('0.5s ease-in-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-5px)', offset: 0.25 }),
        style({ transform: 'translateX(5px)', offset: 0.75 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ]))
    ])
  ]),

  scaleIn: trigger('scaleIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.95)' }),
      animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ])
  ])
}; 