package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.ruolo_utente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
    private String password;

    // Verify Code
    @Column(name = "verification_code")
    private String verificationCode;

    // Expiration Code
    @Column(name = "verification_expiration")
    private LocalDateTime verificationCodeExpiresAt;

    @Column(name = "enabled")
    private boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_authority", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id_user"), inverseJoinColumns = @JoinColumn(name = "authority_name", referencedColumnName = "authority_name"))
    private Set<Authority> authorities = new HashSet<>();

    /*
     * // enum ruolo_utente_utente
     * 
     * @Enumerated(EnumType.STRING)
     * private ruolo_utente ruolo_utente;
     */
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

    // Costruttore
    public Users(String nome, String cognome, String email, ruolo_utente ruolo_utente, String password) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
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

    // @Override
    // public String getUsername() {
    // throw new UnsupportedOperationException("Unimplemented method
    // 'getUsername'");
    // }
    // @Override
    // public boolean isAccountNonExpired() {
    // return true;
    // }
    // @Override
    // public boolean isAccountNonLocked() {
    // return true;
    // }
    // @Override
    // public boolean isCredentialsNonExpired() {
    // return true;
    // }
    // @Override
    // public boolean isEnabled() {
    // return enabled;
    // }
}
