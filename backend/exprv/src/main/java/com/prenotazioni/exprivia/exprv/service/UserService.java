package com.prenotazioni.exprivia.exprv.service;

import java.nio.CharBuffer;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;
import com.prenotazioni.exprivia.exprv.mapper.UserMapper;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserDTO login(CredentialsDto credentialsDto) {
        Users user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new AppException("Utente sconosciuto", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }

        throw new AppException("Password non valida", HttpStatus.BAD_REQUEST);
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

    public Users aggiornaUser(Integer id, Users user) {
        if (userRepository.existsById(id)) {
            user.setId_user(id);
            return userRepository.save(user);
        } else {
            throw new EntityNotFoundException("Utente con ID " + id + " non trovato");
        }
    }

    public void eliminaUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Utente con ID " + id + " non trovato");
        }
    }

}
