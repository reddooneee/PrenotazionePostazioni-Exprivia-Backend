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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.AuthResponseDTO;
import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.EmailDTO;
import com.prenotazioni.exprivia.exprv.dto.ResetPasswordRequest;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.dto.UserRegistrationDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.AuthorityRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;
import com.prenotazioni.exprivia.exprv.security.jwt.JwtTokenProvider;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetService passwordResetService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, AuthorityRepository authorityRepository,
            PasswordEncoder passwordEncoder, UserMapper userMapper, JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager, PasswordResetService passwordResetService,
            EmailService emailService) {
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
     */
    public AuthResponseDTO login(CredentialsDto credentialsDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentialsDto.email(), credentialsDto.password()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            Users user = userRepository.findByEmail(credentialsDto.email())
                    .orElseThrow(() -> new AppException("Utente sconosciuto", HttpStatus.NOT_FOUND));

            String jwt = jwtTokenProvider.generateToken(authentication);

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

    /**
     * Validazione dati di registrazione
     */
    private void validateRegistrationData(UserRegistrationDTO registrationDTO) {
        if (registrationDTO.getNome() == null || registrationDTO.getNome().isEmpty()) {
            throw new IllegalArgumentException("Il nome non può essere nullo!");
        }
        if (registrationDTO.getCognome() == null || registrationDTO.getCognome().isEmpty()) {
            throw new IllegalArgumentException("Il cognome non può essere nullo!");
        }
        if (registrationDTO.getEmail() == null || registrationDTO.getEmail().isEmpty()) {
            throw new IllegalArgumentException("La mail non può essere nulla!");
        }
        if (registrationDTO.getPassword() == null || registrationDTO.getPassword().isEmpty()) {
            throw new IllegalArgumentException("La password non può essere nulla!");
        }
    }

    /**
     * Crea un nuovo utente
     */
    public UserDTO creaUtente(UserRegistrationDTO registrationDTO) {
        validateRegistrationData(registrationDTO);

        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Esiste già un utente con questa email!");
        }

        Users user = userMapper.toEntity(registrationDTO);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assegna il ruolo predefinito "ROLE_USER"
        Authority userAuthority = authorityRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Ruolo ROLE_USER non trovato"));

        Set<Authority> authorities = new HashSet<>();
        authorities.add(userAuthority);
        user.setAuthorities(authorities);

        user.setEnabled(true);
        user.setCreatoIl(LocalDateTime.now());

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    /**
     * Gestione password dimenticata
     */
    public ResponseEntity<?> forgotPassword(EmailDTO emailDTO) {
        String email = emailDTO.email().trim();
        Optional<Users> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email Non Trovata Nel Sistema");
        }

        String token = passwordResetService.createResetToken(email);
        emailService.sendPasswordResetEmail(email, token);

        return ResponseEntity.ok("Email Inviata, Controlla la Posta elettronica");
    }

    /**
     * Reset della password
     */
    public ResponseEntity<?> resetPassword(ResetPasswordRequest resetRequest) {
        Optional<Users> userOpt = passwordResetService.validateToken(resetRequest.token());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token non valido o scaduto");
        }

        Users user = userOpt.get();

        if (resetRequest.newPassword() == null || resetRequest.newPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("La password non può essere vuota");
        }

        String hashedPassword = passwordEncoder.encode(resetRequest.newPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);

        passwordResetService.invalidateToken(resetRequest.token());

        return ResponseEntity.ok("Password aggiornata con successo");
    }
}
