package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.AuthResponseDTO;
import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;
import com.prenotazioni.exprivia.exprv.security.JwtTokenProvider;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    private UserRepository userRepository; //Repo User
    private PasswordEncoder passwordEncoder;
    private UserMapper userMapper; //User Mapper
    private JwtTokenProvider jwtTokenProvider;
    private AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper,
            JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Autenticazione dell'utente
     *
     * @param credentialsDto credenziali di accesso
     * @return AuthResponseDTO contenente il token JWT e i dati dell'utente
     * @throws AppException se le credenziali sono invalide
     */
    public AuthResponseDTO login(CredentialsDto credentialsDto) {
        try {
            // Autenticazione dell'utente con il AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentialsDto.email(), credentialsDto.password()));

            // Se l'autenticazione è riuscita, otteniamo l'utente
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Users user = userRepository.findByEmail(credentialsDto.email())
                    .orElseThrow(() -> new AppException("Utente sconosciuto", HttpStatus.NOT_FOUND));

            // Generazione del token JWT
            String jwt = jwtTokenProvider.generateToken(authentication);

            // Creazione della risposta con token e dati utente
            UserDTO userDTO = userMapper.toDto(user);

            return new AuthResponseDTO(jwt, userDTO);
        } catch (BadCredentialsException e) {
            throw new AppException("Credenziali non valide", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new AppException("Errore durante l'autenticazione", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Valida i dati dell'utente
     *
     * @param userDTO dati da validare
     * @throws IllegalArgumentException se i dati non sono validi
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
        // da aggiungere controllo per authority
    }

    /**
     * Recupera tutti gli utenti dal database
     *
     * @return Lista di UserDTO
     */
    public List<UserDTO> cercaTutti() {
        List<Users> usersList = userRepository.findAll();
        return userMapper.toDtoList(usersList);
    }

    /**
     * Recupera un utente con l'id
     *
     * @return id UserDTO
     */
    public UserDTO cercaSingolo(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente con id " + id + " non trovato"));
        return userMapper.toDto(user);
    }

    /**
     * Cerca un utente tramite l'email
     *
     * @param email indirizzo email dell'utente
     * @return UserDTO dell'utente trovato
     * @throws EntityNotFoundException se l'utente non esiste
     */
    public UserDTO cercaPerEmail(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utente con email " + email + " non trovato"));
        return userMapper.toDto(user);
    }

    /**
     * Crea un nuovo utente
     *
     * @param userDTO dati del nuovo utente
     * @return UserDTO dell'utente creato
     * @throws IllegalArgumentException se ci sono problemi di validazione
     */
    public UserDTO creaUtente(UserDTO userDTO) {
        // Validazione dei dati
        validateUserData(userDTO);

        // Verifica che l'email non sia già in uso
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Esiste già un utente con questa email!");
        }

        // Converti DTO in entity
        Users user = userMapper.toEntity(userDTO);

        // Hash della password
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Salva l'utente
        user = userRepository.save(user);

        // Restituisci il DTO dell'utente salvato
        return userMapper.toDto(user);
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
                    // Gestione delle authorities attraverso il mapper
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

}
