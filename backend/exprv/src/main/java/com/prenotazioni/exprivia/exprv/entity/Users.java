package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Users {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_user; // Primary Key

    @Column(name = "nome", length = 50)
    private String nome;

    @Column(name = "cognome", length = 50)
    private String cognome;

    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", length = 60, nullable = false)
    @JsonIgnore
    private String password;

    // Verify Code
    @Column(name = "verification_code")
    @JsonIgnore
    private String verificationCode;

    // Expiration Code
    @Column(name = "verification_expiration")
    @JsonIgnore
    private LocalDateTime verificationCodeExpiresAt;

    @Column(name = "enabled")
    private Boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_authority", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id_user"), inverseJoinColumns = @JoinColumn(name = "authority_name", referencedColumnName = "authority_name"))
    private Set<Authority> authorities = new HashSet<>();

    @OneToMany(mappedBy = "users")
    @JsonIgnore
    private List<Prenotazioni> prenotazioni = new ArrayList<>();

    // Usare LocalDateTime cosi si tiene traccia anche del tempo.
    // Non vanno nel costruttore, ci pensa Hibernate a gestirli in autonomia
    @CreationTimestamp
    @Column(name = "creatoil")
    private LocalDateTime creatoIl;

    @UpdateTimestamp
    @Column(name = "aggiornatoil")
    private LocalDateTime aggiornatoIl;

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze
    // delle entità tramite reflection
    // Costruttore Vuoto - Per Jpa
    public Users() {
    }

    public Users(Integer id_user, String nome, String cognome, String email, String password, String verificationCode,
            LocalDateTime verificationCodeExpiresAt, Boolean enabled, Set<Authority> authorities,
            LocalDateTime creatoIl, LocalDateTime aggiornatoIl) {
        this.id_user = id_user;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
        this.verificationCode = verificationCode;
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
        this.enabled = enabled;
        this.authorities = authorities;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
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

    public void setCreatoIl(LocalDateTime creatoIl) {
        this.creatoIl = creatoIl;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setAggiornatoIl(LocalDateTime aggiornatoIl) {
        this.aggiornatoIl = aggiornatoIl;
    }

    // Metodi per gestire le authorities
    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    public Users addAuthority(Authority authority) {
        this.authorities.add(authority);
        return this;
    }

    public Users removeAuthority(Authority authority) {
        this.authorities.remove(authority);
        return this;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiresAt() {
        return verificationCodeExpiresAt;
    }

    public void setVerificationCodeExpiresAt(LocalDateTime verificationCodeExpiresAt) {
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
    }

    public List<Prenotazioni> getPrenotazioni() {
        return prenotazioni;
    }

    public void setPrenotazioni(List<Prenotazioni> prenotazioni) {
        this.prenotazioni = prenotazioni;
    }

}
