package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //findall Tutte gli utenti
    public List<Users> cercaTutti() {
        return userRepository.findAll();
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Users cercaSingolo(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente con id " + id + " non trovato"));
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    //Come sopra ma per email, metodo findByEmail da creare nel repository

    //Creazione nuovo utente con enum -> stringa -> enum 
    public Users creaUtente(Users user) {
        //Condizioni per i NOT NULL 
        if (user.getRuolo() == null) {
            throw new IllegalArgumentException("Il ruolo non può essere nullo!");
        }

        if(user.getNome() == null){
            throw new IllegalArgumentException("Il nome non può essere nullo!");
        }

        if(user.getCognome() == null){
            throw new IllegalArgumentException("Il cognome non può essere nullo!");
        }

        if(user.getEmail() == null){
            throw new IllegalArgumentException("La mail non può essere nulla!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Esiste già un utente con questa email!");
        }

        if(user.getPassword() == null){
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
