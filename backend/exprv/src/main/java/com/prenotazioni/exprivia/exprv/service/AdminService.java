package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.dto.UserRegistrationDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.AuthorityRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthorityRepository authorityRepository;

    public AdminService() {
    }

    public AdminService(UserRepository userRepository,
            PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
    }

    /*
     * Validazione Dati Dell'utente
     */
    private void validateUserData(UserRegistrationDTO userRegistrationDTO) {
        if (userRegistrationDTO.getNome() == null || userRegistrationDTO.getNome().isEmpty()) {
            throw new IllegalArgumentException("Il nome non può essere nullo!");
        }
        if (userRegistrationDTO.getCognome() == null || userRegistrationDTO.getCognome().isEmpty()) {
            throw new IllegalArgumentException("Il cognome non può essere nullo!");
        }
        if (userRegistrationDTO.getEmail() == null || userRegistrationDTO.getEmail().isEmpty()) {
            throw new IllegalArgumentException("La mail non può essere nulla!");
        }

    }

    /**
     * Crea un nuovo utente da admin
     *
     * @param adminDTO dati del nuovo utente con ruoli specificati
     * @return UserDTO dell'utente creato
     * @throws IllegalArgumentException se ci sono problemi di validazione
     */
    /**
     * Crea un nuovo utente
     */
    public UserDTO creaUtenteAdmin(UserRegistrationDTO userRegistrationDTO) {
        validateUserData(userRegistrationDTO);

        // Controllo Email Duplicata
        if (userRepository.findByEmail(userRegistrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Esiste già un utente con questa email!");
        }

        Users user = userMapper.toEntity(userRegistrationDTO);
        user.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));

        Set<Authority> authorities = new HashSet<>();

        // Validazione ruoli
        if (userRegistrationDTO.getAuthorities() == null || userRegistrationDTO.getAuthorities().isEmpty()) {
            throw new IllegalArgumentException("È necessario specificare almeno un ruolo per l'utente");
        }

        // Verifica validità dei ruoli
        for (String roleName : userRegistrationDTO.getAuthorities()) {
            if (roleName.isEmpty()) {
                throw new IllegalArgumentException("L'utente deve avere almeno un ruolo");
            }

            Authority authority = authorityRepository.findByName(roleName)
                    .orElseThrow(() -> new IllegalArgumentException("Ruolo non valido: " + roleName));
            authorities.add(authority);
        }

        user.setAuthorities(authorities);
        user.setEnabled(true);
        user.setCreatoIl(LocalDateTime.now());

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    /**
     * Aggiorna un utente esistente con i valori specificati (ADMIN)
     *
     * @param id      ID dell'utente da aggiornare
     * @param updates mappa dei campi da aggiornare
     * @return AdminDTO dell'utente aggiornato
     * @throws AccessDeniedException    se l'utente non ha i permessi necessari
     * @throws IllegalArgumentException se i dati forniti non sono validi
     */
    public AdminDTO aggiornaUserByAdmin(Integer id, Map<String, Object> updates) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new AccessDeniedException("Accesso negato: solo un amministratore può aggiornare un utente");
        }

        Users existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente con ID " + id + " non trovato"));

        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            Optional<Users> userWithSameEmail = userRepository.findByEmail(newEmail);
            if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId_user().equals(id)) {
                throw new IllegalArgumentException("Email già in uso");
            }
        }

        updates.forEach((key, value) -> {
            switch (key) {
                case "nome":
                    existingUser.setNome((String) value);
                    break;
                case "cognome":
                    existingUser.setCognome((String) value);
                    break;
                case "email":
                    existingUser.setEmail((String) value);
                    break;
                case "password":
                    existingUser.setPassword(passwordEncoder.encode((String) value));
                    break;
                case "authorities":
                    if (value instanceof Set) {
                        @SuppressWarnings("unchecked")
                        Set<String> authorities = (Set<String>) value;
                        existingUser.setAuthorities(userMapper.stringsToAuthorities(authorities));
                    }
                    break;
                case "enabled":
                    existingUser.setEnabled((Boolean) value);
                    break;
            }
        });

        existingUser.setAggiornatoIl(LocalDateTime.now());
        Users updatedUser = userRepository.save(existingUser);
        return new AdminDTO(updatedUser);
    }

}
