package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.AuthResponseDTO;
import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.EmailDTO;
import com.prenotazioni.exprivia.exprv.dto.ResetPasswordRequest;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.AuthorityRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;
import com.prenotazioni.exprivia.exprv.security.jwt.JwtTokenProvider;

@Service
public class AuthService {

    private UserRepository userRepository; // Repo User
    private AuthorityRepository authorityRepository;
    private PasswordEncoder passwordEncoder;
    private UserMapper userMapper; // User Mapper
    private JwtTokenProvider jwtTokenProvider;
    private AuthenticationManager authenticationManager;
    private PasswordResetService passwordResetService;
    private EmailService emailService;

    public AuthService(UserRepository userRepository, AuthorityRepository authorityRepository,
            PasswordEncoder passwordEncoder, UserMapper userMapper, JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager, PasswordResetService passwordResetService, EmailService emailService) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordResetService = passwordResetService;
        this.emailService = emailService;
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

            // Verifica se l'utente ha il ruolo di ADMIN
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(auth -> auth.getName().equals("ROLE_ADMIN"));

            if (isAdmin) {
                AdminDTO adminDTO = userMapper.toAdminDto(user);
                return AuthResponseDTO.forAdmin(jwt, adminDTO);
            } else {
                UserDTO userDTO = userMapper.toDto(user);
                return AuthResponseDTO.forUser(jwt, userDTO);
            }
        } catch (BadCredentialsException e) {
            throw new AppException("Credenziali non valide", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new AppException("Errore durante l'autenticazione", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

        // Assegna il ruolo predefinito "ROLE_USER"
        Authority userAuthority = authorityRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Ruolo ROLE_USER non trovato"));

        Set<Authority> authorities = new HashSet<>();
        authorities.add(userAuthority);
        user.setAuthorities(authorities);

        // Imposta altri campi necessari
        user.setEnabled(true);
        user.setCreatoIl(LocalDateTime.now());

        // Salva l'utente
        user = userRepository.save(user);

        // Restituisci il DTO dell'utente salvato
        return userMapper.toDto(user);
    }


    /*
     * Forgot Password
     */
    public ResponseEntity<?> forgotPassword(@RequestBody EmailDTO emailDTO) {

        String email = emailDTO.getEmail().trim();
        // Verifica prima se l'utente esiste
        Optional<Users> userOpt = userRepository.findByEmailIgnoreCase(email);

        //Se non viene trovato l'utente viene stampato il messaggio sotto
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email Non Trovata Nel Sistema");
        }
        //Generazione TokenUUID Di Reset
        String token = passwordResetService.createResetToken(emailDTO.getEmail());

        //Invio Email Con URL + TokenUUID
        emailService.sendPasswordResetEmail(email, token);

        return ResponseEntity.ok("Email Inviata, Controlla la Posta elettronica");
    }

    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {

        //Verifica il token e ottieni l'utente
        Optional<Users> userOpt = passwordResetService.validateToken(resetPasswordRequest.getToken());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token non valido o scaduto");
        }

        Users user = userOpt.get();

        //Verifica che la nuova password non sia null o vuota
        if (resetPasswordRequest.getNewPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("La password non può essere vuota");
        }

        //BCrypt per fare l'hash della password
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(resetPasswordRequest.getNewPassword());

        // Imposta la password hashata sull'utente
        user.setPassword(hashedPassword);

        //Salva l'utente con la nuova password
        userRepository.save(user);

        // Invalida il token dopo averlo usato
        passwordResetService.invalidateToken(resetPasswordRequest.getToken());

        return ResponseEntity.ok("Password aggiornata con successo");

    }

}
