package com.prenotazioni.exprivia.exprv.dto;

import java.util.Set;

/**
 * Record che rappresenta la risposta di autenticazione con token JWT e dati utente.
 */
public record AuthResponseDTO(String token, String email, Set<String> authorities) {
    
    /**
     * Costruttore per utenti normali
     */
    public static AuthResponseDTO forUser(String token, UserDTO user) {
        return new AuthResponseDTO(token, user.getEmail(), user.getAuthorities());
    }
    
    /**
     * Costruttore per utenti admin
     */
    public static AuthResponseDTO forAdmin(String token, AdminDTO admin) {
        return new AuthResponseDTO(token, admin.getEmail(), admin.getAuthorities());
    }
}