package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
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
     * Valida i dati dell'utente
     *
     * @param userDTO dati da validare
     * @throws IllegalArgumentException se i dati non sono validi
     */
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
     * Aggiorna un utente esistente con i valori specificati
     *
     * @param id ID dell'utente da aggiornare
     * @param updates mappa dei campi da aggiornare
     * @return UserDTO dell'utente aggiornato
     * @throws EntityNotFoundException se l'utente non esiste
     */
    public UserDTO aggiornaUser(Integer id, Map<String, Object> updates) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new AccessDeniedException("Accesso negato: solo un amministratore può aggiornare un utente");
        }

        Users existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));

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
            }
        });

        Users updatedUser = userRepository.save(existingUser);
        return userMapper.toDto(updatedUser);
    }

    /**
     * Aggiorna un utente con i dati forniti in un DTO
     *
     * @param id ID dell'utente da aggiornare
     * @param userDTO dati aggiornati dell'utente
     * @return UserDTO dell'utente aggiornato
     */
    public UserDTO aggiornaUserConDTO(Integer id, UserDTO userDTO) {
        Users existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));

        // Verifica che l'email non sia già in uso (se è stata modificata)
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(existingUser.getEmail())) {
            Optional<Users> userWithSameEmail = userRepository.findByEmail(userDTO.getEmail());
            if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId_user().equals(id)) {
                throw new IllegalArgumentException("Email già in uso");
            }
        }

        // Gestisci la password separatamente per l'hashing
        String password = null;
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            password = passwordEncoder.encode(userDTO.getPassword());
            userDTO.setPassword(null); // Rimuovi la password dal DTO per evitare che sovrascriva quella hashata
        }

        // Aggiorna l'utente con i dati del DTO
        userMapper.updateUserFromDto(userDTO, existingUser);

        // Imposta la password hashata se necessario
        if (password != null) {
            existingUser.setPassword(password);
        }

        // Salva le modifiche
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
        String email = authentication.getName();  // Ottieni l'email dell'utente autenticato
    
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utente con email " + email + " non trovato"));
    
        return userMapper.toDto(user);  // Restituisci il DTO dell'utente
    }
    
    public UserDTO findByEmail(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utente con email " + email + " non trovato"));
        return userMapper.toDto(user);
    }

}
