package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.User;
import com.prenotazioni.exprivia.exprv.repository.UserRepository; // Correct import

@Service
public class UserService {

//Repository
    @Autowired
    private UserRepository repository;

//Costuttore
    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;

    }

// 🔹 1. Metodo per ottenere tutte le stanze
    public List<User> findAll() {
        return repository.findAll();
    }

}
