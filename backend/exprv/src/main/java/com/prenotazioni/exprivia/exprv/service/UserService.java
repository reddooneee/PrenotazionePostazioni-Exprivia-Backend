package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.ruolo_utente;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;
import com.prenotazioni.exprivia.exprv.security.AuthoritiesConstants;
import com.prenotazioni.exprivia.exprv.repository.AuthorityRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
    }

    public UserDTO login(CredentialsDto credentialsDto) {

        Users user = userRepository.findByemail(credentialsDto.email())
                .orElseThrow(() -> new AppException("Utente sconosciuto", HttpStatus.NOT_FOUND));
        if (passwordEncoder.matches(credentialsDto.password(), user.getPassword())) {
            return UserMapper.INSTANCE.toUserDTO(user);
        }

        throw new AppException("Password non valida", HttpStatus.BAD_REQUEST);
    }

    //FindAllo con DTO
    public List<UserDTO> cercaTutti() {
        List<Users> usersList = userRepository.findAll();
        return usersList.stream()
                .map(UserMapper.INSTANCE::toUserDTO)
                .toList();
    }

    // Ricerca singola tramite id ma con messaggino personalizzato invece che null
    //Cerca Singo con DTO
    public UserDTO cercaSingolo(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente con id " + id + " non trovato"));
        return UserMapper.INSTANCE.toUserDTO(user);
    }

    // Ricerca singola tramite id 
    //creaUtente con DTO
    @Transactional
    public User creaUtente(UserDTO userDTO) {
        // Converte il DTO in entità Users
        Users user = userMapper.toUser(userDTO);

        // // Condizioni per i NOT NULL
        // if (user.() == null) {
        //     throw new IllegalArgumentException("Il ruolo non può essere nullo!");
        // }
        // if (user.getNome() == null || user.getNome().isEmpty()) {
        //     throw new IllegalArgumentException("Il nome non può essere nullo!");
        // }
        // if (user.getCognome() == null || user.getCognome().isEmpty()) {
        //     throw new IllegalArgumentException("Il cognome non può essere nullo!");
        // }
        // if (user.getEmail() == null || user.getEmail().isEmpty()) {
        //     throw new IllegalArgumentException("La mail non può essere nulla!");
        // }
        // if (userRepository.existsByEmail(user.getEmail())) {
        //     throw new IllegalArgumentException("Esiste già un utente con questa email!");
        // }
        // if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
        //     throw new IllegalArgumentException("La password non può essere nulla!");
        // }
        // Hash della password
        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
        user.setPassword(hashedPassword); // Setta la password sull'entità

        Users savedUser = userRepository.save(user);

        return userMapper.toUserDTO(savedUser);
    }

    //AggiornaUser con DTO
    public UserDTO aggiornaUser(Integer id, Map<String, Object> updates) {
        Users existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));

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
                case "ruolo_utente":
                    existingUser.setRuolo_utente(ruolo_utente.valueOf((String) value));
                    break;
            }
        });

        Users updatedUser = userRepository.save(existingUser);
        return UserMapper.INSTANCE.toUserDTO(updatedUser);
    }

    public void eliminaUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Utente con ID " + id + " non trovato");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Cerca l'utente nel database con la email
        Users user = userRepository.findByemail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + email));

        // Mappa l'utente in un oggetto UserDetails
        return User.builder()
                .username(user.getEmail()) // puoi usare anche l'email se preferisci
                .password(user.getPassword()) // la password è già hashata nel database
                .authorities(user.getRuolo_utente().name()) // aggiungi i ruoli
                .build();
    }

}
