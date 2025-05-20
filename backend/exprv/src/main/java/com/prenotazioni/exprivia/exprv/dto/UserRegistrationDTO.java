package com.prenotazioni.exprivia.exprv.dto;

import java.util.HashSet;
import java.util.Set;

public class UserRegistrationDTO {

    private String nome;
    private String cognome;
    private String email;
    private String password;
    private Set<String> authorities;

    // private Set<String> authorities

    public UserRegistrationDTO(String nome, String cognome, String email, String password, Set<String> authorities) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
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

    public Set<String> getAuthorities() {
        if (authorities == null) {
            authorities = new HashSet<>();
        }

        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

    public UserRegistrationDTO() {
        this.authorities = new HashSet<>();
    }

    // ToString per debug
    @Override
    public String toString() {
        return "UserRegistrationDTO{" +
                "nome='" + nome + '\'' +
                ", cognome='" + cognome + '\'' +
                ", email='" + email + '\'' +
                ", authorities=" + authorities +
                '}';
    }

}
