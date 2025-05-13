package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.HashSet;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;

import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.repository.AuthorityRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDTO userDTO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthorityRepository authorityRepository;

    public AdminService() {
    }

    public AdminService(UserRepository userRepository, UserDTO userDTO,
            PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;
        this.userDTO = userDTO;

        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
    }

    /*
     * Validazione Dati Dell'utente
     */
    private void validateUserData(UserDTO userDTO) {
        if (userDTO.getNome() == null || userDTO.getNome().isEmpty()) {
            throw new IllegalArgumentException("Il nome non può essere nullo!");
        }
        if (userDTO.getCognome() == null || userDTO.getCognome().isEmpty()) {
            throw new IllegalArgumentException("Il cognome non può essere nullo!");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().isEmpty()) {
            throw new IllegalArgumentException("La mail non può essere nulla!");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            throw new IllegalArgumentException("La password non può essere nulla!");
        }
    }

    /**
     * Crea un nuovo utente da admin
     *
     * @param adminDTO dati del nuovo utente con ruoli specificati
     * @return UserDTO dell'utente creato
     * @throws IllegalArgumentException se ci sono problemi di validazione
     */
    public AdminDTO creaUtenteAdmin(AdminDTO adminDTO) {
        validateUserData(userDTO);

        // Verifica che l'email non sia già in uso
        if (userRepository.findByEmail(adminDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Esiste già un utente con questa email!");
        }

        // Crea un nuovo Users
        Users user = new Users();
        user.setNome(adminDTO.getNome());
        user.setCognome(adminDTO.getCognome());
        user.setEmail(adminDTO.getEmail());
        user.setPassword(passwordEncoder.encode(adminDTO.getPassword()));

        // Verifica e assegna i ruoli specificati dall'admin
        Set<Authority> authorities = new HashSet<>();
        for (String roleName : adminDTO.getAuthorities()) {
            Authority authority = authorityRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Ruolo " + roleName + " non trovato"));
            authorities.add(authority);
        }
        user.setAuthorities(authorities);

        // Imposta altri campi necessari
        user.setEnabled(true);
        user.setCreatoIl(LocalDateTime.now());

        // Salva l'utente
        user = userRepository.save(user);

        // Crea e restituisci AdminDTO
        AdminDTO responseDTO = new AdminDTO();
        responseDTO.setNome(user.getNome());
        responseDTO.setCognome(user.getCognome());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setAuthorities(user.getAuthorities().stream()
                .map(Authority::getName)
                .collect(java.util.stream.Collectors.toSet()));
        return responseDTO;
    }

}
