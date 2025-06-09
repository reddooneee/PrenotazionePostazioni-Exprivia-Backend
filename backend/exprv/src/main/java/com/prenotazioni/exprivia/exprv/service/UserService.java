package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
import com.prenotazioni.exprivia.exprv.security.jwt.JwtTokenProvider;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    private UserRepository userRepository; // Repo User
    private AuthorityRepository authorityRepository;
    private PasswordEncoder passwordEncoder;
    private UserMapper userMapper; // User Mapper

    public UserService(UserRepository userRepository, AuthorityRepository authorityRepository,
            PasswordEncoder passwordEncoder, UserMapper userMapper,
            JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.authorityRepository = authorityRepository;
    }

    /**
     * Recupera tutti gli utenti dal database come AdminDTO (per utenti con
     * ruolo ADMIN)
     *
     * @return Lista di AdminDTO
     */
    public List<AdminDTO> cercaTutti() {
        List<Users> usersList = userRepository.findAll();
        return userMapper.toAdminDtoList(usersList);
    }

    /**
     * Recupera un utente con l'id come AdminDTO (per utenti con ruolo ADMIN)
     *
     * @return AdminDTO
     */
    public AdminDTO cercaSingolo(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utente con id " + id + " non trovato"));
        return new AdminDTO(user);
    }

    /**
     * Recupera un utente tramite email come AdminDTO (per utenti con ruolo
     * ADMIN)
     *
     * @return AdminDTO
     */
    public AdminDTO cercaPerEmail(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utente con email " + email + " non trovato"));
        return new AdminDTO(user);
    }

    public Authority getAuthorityByName(String name) {
        return authorityRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Authority not found with name: " + name));
    }

    /**
     * Aggiorna un utente con i dati forniti
     *
     * @param id      ID dell'utente da aggiornare
     * @param updates mappa dei campi da aggiornare
     * @return UserDTO dell'utente aggiornato
     * @throws EntityNotFoundException  se l'utente non esiste
     * @throws IllegalArgumentException se i dati forniti non sono validi
     */
    public UserDTO aggiornaUser(Integer id, Map<String, Object> updates) {
        Users existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));

        // Verifica email duplicata
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            Optional<Users> userWithSameEmail = userRepository.findByEmail(newEmail);
            if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId_user().equals(id)) {
                throw new IllegalArgumentException("Email già in uso");
            }
        }

        // Verifica password attuale se si sta tentando di cambiare la password
        if (updates.containsKey("password")) {
            String currentPassword = (String) updates.get("currentPassword");
            String newPassword = (String) updates.get("password");
            
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                throw new IllegalArgumentException("La password attuale è richiesta per modificare la password");
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                throw new IllegalArgumentException("La nuova password non può essere vuota");
            }
            
            // Verifica che la password attuale corrisponda a quella nel database
            if (!passwordEncoder.matches(currentPassword, existingUser.getPassword())) {
                throw new IllegalArgumentException("Password attuale non corretta");
            }
        }

        // Aggiorna i campi
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
                case "currentPassword":
                    // Non fare nulla - questo campo è solo per la verifica
                    break;
                default:
                    throw new IllegalArgumentException("Campo non valido per l'aggiornamento: " + key);
            }
        });

        existingUser.setAggiornatoIl(LocalDateTime.now());
        Users updatedUser = userRepository.save(existingUser);
        return userMapper.toDto(updatedUser);
    }

    /**
     * Elimina un utente dal sistema
     *
     * @param id ID dell'utente da eliminare
     * @throws EntityNotFoundException se l'utente non esiste
     */
    public void eliminaUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Utente con ID " + id + " non trovato");
        }
        userRepository.deleteById(id);
    }

    public UserDetails loadUserByUsername(String email) {
        throw new UnsupportedOperationException("Unimplemented method 'loadUserByUsername'");
    }

    public UserDTO getDetailsForAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Ottieni l'email dell'utente autenticato

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utente con email " + email + " non trovato"));

        return userMapper.toDto(user); // Restituisci il DTO dell'utente
    }

    public UserDTO findByEmail(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utente con email " + email + " non trovato"));
        return userMapper.toDto(user);
    }

    public UserDTO creaUser(UserRegistrationDTO userRegistrationDTO) {
        if (userRegistrationDTO.getEmail() == null || userRegistrationDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("L'email è obbligatoria");
        }

        if (userRegistrationDTO.getPassword() == null || userRegistrationDTO.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("La password è obbligatoria");
        }

        if (userRepository.findByEmail(userRegistrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email già registrata");
        }

        Users user = new Users();
        user.setEmail(userRegistrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        user.setNome(userRegistrationDTO.getNome());
        user.setCognome(userRegistrationDTO.getCognome());

        Users savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

}
