import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { AuthJwtService } from '../auth/auth-jwt.service';  // Importa il servizio AuthJwtService

@Directive({
  selector: '[hasRole]'  // Selettore che userai nel template (ad esempio [hasRole]="['ROLE_ADMIN']")
})
export class HasRoleDirective implements OnInit {
  
  @Input() hasRole: string[] = [];  // I ruoli che devono essere verificati
  
  constructor(
    private el: ElementRef,  // Riferimento all'elemento DOM
    private renderer: Renderer2,  // Renderer per manipolare il DOM in modo sicuro
    private authJwtService: AuthJwtService  // Servizio per ottenere i ruoli dell'utente
  ) {}

  ngOnInit() {
    // Verifica se l'utente ha uno dei ruoli richiesti
    const userRoles = this.authJwtService.getUserRoles();
    const hasRequiredRole = this.hasRole.some(role => userRoles.includes(role));

    // Se l'utente ha il ruolo richiesto, lascia l'elemento visibile, altrimenti nascondilo
    if (!hasRequiredRole) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
    }
  }
}
