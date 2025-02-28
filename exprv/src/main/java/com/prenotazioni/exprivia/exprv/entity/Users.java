package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.ruoli;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Users {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_user; //Primary Key
    private String nome;
    private String cognome;
    private String email;
    private String password;

    // enum ruoli
    @Enumerated(EnumType.STRING)
    private ruoli ruolo;

    //Usare LocalDateTime cosi si tiene traccia anche del tempo.
    //Non vanno nel costruttore, ci pensa Hibernate a gestirli in autonomia
    @CreationTimestamp
    private LocalDateTime creatoIl;

    @UpdateTimestamp
    private LocalDateTime aggiornatoIl;

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
    // Costruttore Vuoto - Per Jpa
    public Users() {
    }

    // Costruttore
    public Users(Integer id_user, String nome, String cognome, String email, ruoli ruolo, String password) {
        this.id_user = id_user;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.ruolo = ruolo;
        this.password = password;
    }

    // Setters And Getters
    public Integer getId_user() {
        return id_user;
    }

    public void setId_user(Integer id_user) {
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

    public LocalDateTime getCreatoIl() {
        return creatoIl;
    }

    public LocalDateTime getAggiornatoIl() {
        return aggiornatoIl;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
