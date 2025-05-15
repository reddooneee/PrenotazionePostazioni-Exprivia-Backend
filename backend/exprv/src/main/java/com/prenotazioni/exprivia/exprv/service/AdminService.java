package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.repository.AuthorityRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    // @Autowired
    // private UserDTO userDTO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthorityRepository authorityRepository;

    public AdminService() {
    }

    public AdminService(UserRepository userRepository,
            PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;
        // this.userDTO = userDTO;

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

    }

    /**
     * Crea un nuovo utente da admin
     *
     * @param adminDTO dati del nuovo utente con ruoli specificati
     * @return UserDTO dell'utente creato
     * @throws IllegalArgumentException se ci sono problemi di validazione
     */
    public AdminDTO creaUtenteAdmin(UserDTO userDTO) {
    validateUserData(userDTO);

    if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
        throw new IllegalArgumentException("Esiste già un utente con questa email!");
    }

    Users user = new Users();
    user.setNome(user.getNome());
    user.setCognome(user.getCognome());
    user.setEmail(user.getEmail());
    user.setPassword(passwordEncoder.encode(user.getPassword()));

    Set<Authority> authorities = new HashSet<>();
    for (String roleName : userDTO.getAuthorities()) {
        Authority authority = authorityRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Ruolo " + roleName + " non trovato"));
        authorities.add(authority);
    }
    user.setAuthorities(authorities);

    user.setEnabled(true);
    user.setCreatoIl(LocalDateTime.now());

    user = userRepository.save(user);

    // Se hai un mapper da Users a AdminDTO, usa quello (consigliato):
    // return adminMapper.toDto(user)

    return new AdminDTO(user);
}
}
