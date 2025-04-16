package com.prenotazioni.exprivia.exprv.dto;

/**
 * Record che rappresenta la risposta di autenticazione con token JWT e dati utente.
 */
public record AuthResponseDTO(String token, Object userInfo, boolean isAdmin) {
    
    /**
     * Costruttore per utenti normali
     */
    public static AuthResponseDTO forUser(String token, UserDTO user) {
        return new AuthResponseDTO(token, user, false);
    }
    
    /**
     * Costruttore per utenti admin
     */
    public static AuthResponseDTO forAdmin(String token, AdminDTO admin) {
        return new AuthResponseDTO(token, admin, true);
    }
}