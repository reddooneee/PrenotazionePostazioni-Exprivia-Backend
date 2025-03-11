package com.prenotazioni.exprivia.exprv.service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.ruolo_utente;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO login(CredentialsDto credentialsDto) {

        Users user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new AppException("Utente sconosciuto", HttpStatus.NOT_FOUND));
        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return UserMapper.INSTANCE.toUserDTO(user);
        }
        throw new AppException("Password invalida", HttpStatus.BAD_REQUEST);
    }

    // findall Tutte gli utenti
    public List<Users> cercaTutti() {
        return userRepository.findAll();
    }

    // Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Users cercaSingolo(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente con id " + id + " non trovato"));
    }

    // Ricerca singola tramite id ma con messaggino personalizzato invece che null
    // Come sopra ma per email, metodo findByEmail da creare nel repository
    // Creazione nuovo utente con enum -> stringa -> enum
    @Transactional
    public Users creaUtente(Users user) {
        // Condizioni per i NOT NULL
        if (user.getRuolo_utente() == null) {
            throw new IllegalArgumentException("Il ruolo non può essere nullo!");
        }

        if (user.getNome() == null) {
            throw new IllegalArgumentException("Il nome non può essere nullo!");
        }

        if (user.getCognome() == null) {
            throw new IllegalArgumentException("Il cognome non può essere nullo!");
        }

        if (user.getEmail() == null) {
            throw new IllegalArgumentException("La mail non può essere nulla!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Esiste già un utente con questa email!");
        }

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("La password non può essere nulla!");
        }

        return userRepository.save(user);
    }
    
    public Users aggiornaUser(Integer id, Map<String, Object> updates) {
        Users existingUser = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));
    
        updates.forEach((key, value) -> {
                switch (key) {
                case "nome": existingUser.setNome((String) value); break;
                case "cognome": existingUser.setCognome((String) value); break;
                case "email": existingUser.setEmail((String) value); break;
                case "login": existingUser.setLogin((String) value); break;
                case "password": existingUser.setPassword((String) value); break;
                case "ruolo_utente": existingUser.setRuolo_utente(ruolo_utente.valueOf((String) value)); break;
            }
        });
    
        return userRepository.save(existingUser);
    } 

    public void eliminaUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Utente con ID " + id + " non trovato");
        }
    }

}
