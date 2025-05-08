package com.prenotazioni.exprivia.exprv.dto;

import java.util.Set;
import java.util.stream.Collectors;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;

public class UserDTO {

    private Integer id_user;
    private String nome;
    private String cognome;
    private String email;
    private String password;
    private Boolean enabled;
    private Set<String> authorities;

    // Costruttore vuoto
    public UserDTO() {
    }

    // Costruttore con parametri
    public UserDTO(Integer id_user, String nome, String cognome, String email, String password, Boolean enabled) {
        this.id_user = id_user;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
    }

    public UserDTO(Users user) {
        this.id_user = user.getId_user();
        this.nome = user.getNome();
        this.cognome = user.getCognome();
        this.email = user.getEmail();
        this.authorities = user.getAuthorities().stream()
                .map(Authority::getName)
                .collect(Collectors.toSet());
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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

}
