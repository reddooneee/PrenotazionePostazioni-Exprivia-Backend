package com.prenotazioni.exprivia.exprv.entity;

import com.prenotazioni.exprivia.exprv.enumerati.ruoli;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

//import jakarta.persistence.Entity;
@Entity
public class User {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id_user; //Primary Key
    private String nome;
    private String cognome;
    private String email;

    private ruoli ruolo;

//Costruttore
    public User(Long id_user, String nome, String cognome, String email, ruoli ruolo) {

        this.id_user = id_user;
        this.cognome = cognome;
        this.email = email;
        this.ruolo = ruolo;

    }
//Setters And Getters

    public Long getId_user() {
        return id_user;
    }

    public void setId_user(Long id_user) {
        this.id_user = id_user;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ruoli getRuolo() {
        return ruolo;
    }

    public void setRuolo(ruoli ruolo) {
        this.ruolo = ruolo;
    }

}
