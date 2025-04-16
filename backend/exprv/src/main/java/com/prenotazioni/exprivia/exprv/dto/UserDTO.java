package com.prenotazioni.exprivia.exprv.dto;


public class UserDTO {

    private Integer id_user;
    private String nome;
    private String cognome;
    private String email;
    private String password;
    private Boolean enabled;

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

}
