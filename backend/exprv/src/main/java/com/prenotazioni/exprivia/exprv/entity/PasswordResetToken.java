package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user", nullable = false)
    private Users id_user;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    // Costruttore vuoto richiesto da JPA
    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, Users user, LocalDateTime expiryDate) {
        this.token = token;
        this.id_user = user;
        this.expiryDate = expiryDate;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Users getUser() {
        return id_user;
    }

    public void setUser(Users id_user) {
        this.id_user = id_user;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}
