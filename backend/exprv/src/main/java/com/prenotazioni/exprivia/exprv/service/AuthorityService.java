package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.security.AuthoritiesConstants;

@Service
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

    /**
     * Recupera i ruoli correnti dell'utente autenticato.
     *
     * @return lista di autorità (es. ROLE_ADMIN, ROLE_USER)
     */
    public static List<String> getCurrentUserRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return List.of();
        }

        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }

    /*
     * Verifica se l'utente é un admin
     * 
     * @return true se é un adim
     */
    public static boolean isAdmin() {
        return hasAuthority(AuthoritiesConstants.ADMIN);
    }

}
