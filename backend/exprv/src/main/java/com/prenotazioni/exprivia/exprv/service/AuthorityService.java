package com.prenotazioni.exprivia.exprv.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.prenotazioni.exprivia.exprv.security.AuthoritiesConstants;

public class AuthorityService {

    /**
     * Controllo utente se ha un authority.
     *
     * @param authority l'autorità da verificare
     * @return true se l'utente ha l'autorità, false altrimenti
     */
    public static boolean hasAuthority(String authority) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .map(ga -> ga.getAuthority())
                .anyMatch(auth -> auth.equals(authority));
    }

    /*
     * Verifica se l'utente é un admin
     * @return true se é un adim
     */
    public static boolean isAdmin() {
        return hasAuthority(AuthoritiesConstants.ADMIN);
    }

}
