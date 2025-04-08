package com.prenotazioni.exprivia.exprv.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails; // il tuo repository per gli utenti
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Cerca l'utente nel database con il nome utente o email
        Users user = userRepository.findByemail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con username: " + email));

        // Mappa l'utente in un oggetto UserDetails
        return User.builder()
                .username(user.getEmail()) // puoi usare anche l'email se preferisci
                .password(user.getPassword()) // la password è già hashata nel database
                .authorities(user.getRuolo_utente().name()) // aggiungi i ruoli
                .build();
    }
}
