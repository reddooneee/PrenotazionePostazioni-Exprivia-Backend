package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException; // Correct import

@Service
public class UserService {

    /*/Repository
    @Autowired
    private final UserRepository repository;

//Costuttore
    public UserService(UserRepository repository) {
        this.repository = repository;

    }


    public List<User> findAll() {
        return repository.findAll();
    }
     */
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //findall Tutte gli utenti
    public List<Users> cercaTutti() {
        return userRepository.findAll();
    }

    /*
	public User cercaSingolo(Long id) {
	    return userRepository.findById(id).orElse(null);	// Restituisce null se non trova l'utente
	}
	
     */
    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Users cercaSingolo(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente con id " + id + " non trovato"));
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    //Come sopra ma per email, metodo findByEmail da creare nel repository
    /*public User cercaPerEmail(String email) {
	    return userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Utente con email " + email + " non trovato"));
	}*/
    public Users aggiungiUser(Users user) {
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
