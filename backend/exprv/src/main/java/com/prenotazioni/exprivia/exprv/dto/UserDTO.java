package com.prenotazioni.exprivia.exprv.dto;

import com.prenotazioni.exprivia.exprv.enumerati.ruolo_utente;

public class UserDTO {

    private Integer id_user;
    private String nome;
    private String cognome;
    private String email;
    private String token;
    private String password;
    private ruolo_utente ruolo_utente;

    // Costruttore vuoto
    public UserDTO() {
    }

    // Costruttore con parametri
    public UserDTO(Integer id_user, String nome, String cognome, String email, String token, String password, ruolo_utente ruolo_utente) {
        this.id_user = id_user;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.token = token;
        this.password = password;
        this.ruolo_utente = ruolo_utente;
    }

    // Getters e Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ruolo_utente getRuolo_utente() {
        return ruolo_utente;
    }

    public void setRuolo_utente(ruolo_utente ruolo_utente) {
        this.ruolo_utente = ruolo_utente;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
