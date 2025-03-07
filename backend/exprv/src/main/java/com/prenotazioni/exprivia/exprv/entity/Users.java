package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.ruolo_utente;

import jakarta.persistence.Column;
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

    @Column(length = 50)    //Forza Hibernate a stare con varchar(50) invece che dimensione predefinita
    private String nome;

    @Column(length = 50)
    private String cognome;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String password;

    private String login; 

    private String token;

    // enum ruolo_utente_utente
    @Enumerated(EnumType.STRING)
    private ruolo_utente ruolo_utente;

    //Usare LocalDateTime cosi si tiene traccia anche del tempo.
    //Non vanno nel costruttore, ci pensa Hibernate a gestirli in autonomia
    @CreationTimestamp
    @Column(name = "creatoil")
    private LocalDateTime creatoIl;

    @UpdateTimestamp
    @Column(name = "aggiornatoil")
    private LocalDateTime aggiornatoIl;

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
    // Costruttore Vuoto - Per Jpa
    public Users() {
    }

    // Costruttore
    public Users(Integer id_user, String nome, String cognome, String email, ruolo_utente ruolo_utente, String password) {
        this.id_user = id_user;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.ruolo_utente = ruolo_utente;
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

    public ruolo_utente getRuolo_utente() {
        return ruolo_utente;
    }

    public void setRuolo_utente(ruolo_utente ruolo_utente) {
        this.ruolo_utente = ruolo_utente;
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
