package com.prenotazioni.exprivia.exprv.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "email"
)
public class UserDTO {

    private String nome;
    private String cognome;
    private String email;
    private Set<String> authorities;

    // Costruttore vuoto
    public UserDTO() {
    }

    // Costruttore con parametri
    public UserDTO( String nome, String cognome, String email, String password, Boolean enabled) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
    }

    public UserDTO(Users user) {
        this.nome = user.getNome();
        this.cognome = user.getCognome();
        this.email = user.getEmail();
        this.authorities = user.getAuthorities().stream()
                .map(Authority::getName)
                .collect(Collectors.toSet());
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


    public Set<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

}
