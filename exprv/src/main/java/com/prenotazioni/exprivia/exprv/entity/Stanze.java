package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Stanze {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id_stanza;

    private String nome;
    private String utilizzo_stanza;

    private int capienza_stanza_persone;
    private int capienza_stanza_postazioni;

    @CreationTimestamp
    private LocalDate creatoIl;

    @CreationTimestamp
    private LocalDate aggiornatoIl;
//Creato Il, Aggioranto il (TIMESTAMP)

//JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
//Costruttore Vuoto - Per Jpa
    public Stanze() {
    }

//Costruttore Con Argomenti
    public Stanze(Long id_stanza, String utilizzo_stanza, String nome, LocalDate creatoIl, LocalDate aggiorantoIl, int capienza_stanza_persone, int capienza_stanza_postazioni) {
        this.utilizzo_stanza = utilizzo_stanza;
        this.id_stanza = id_stanza;
        this.nome = nome;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiorantoIl;
        this.capienza_stanza_persone = capienza_stanza_persone;
        this.capienza_stanza_postazioni = capienza_stanza_postazioni;
    }

//Setters And Getters
    public Long getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Long id_stanza) {
        this.id_stanza = id_stanza;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUtilizzo_stanza() {
        return utilizzo_stanza;
    }

    public void setUtilizzo_stanza(String utilizzo_stanza) {
        this.utilizzo_stanza = utilizzo_stanza;
    }

    public LocalDate getCreatoIl() {
        return creatoIl;
    }

    public LocalDate getAggiornatoIl() {
        return aggiornatoIl;
    }

    public int getCapienza_stanza_persone() {
        return capienza_stanza_persone;
    }

    public void setCapienza_stanza_persone(int capienza_stanza) {
        this.capienza_stanza_persone = capienza_stanza_persone;
    }

    public int getCapienza_stanza_postazioni() {
        return capienza_stanza_postazioni;
    }

    public void setCapienza_stanza_postazioni(int capienza_stanza_postazioni) {
        this.capienza_stanza_postazioni = capienza_stanza_postazioni;
    }

}
