package com.prenotazioni.exprivia.exprv.entity;

//import LocalDate
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.stati;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Postazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id_postazione;

    private Long id_stanza; // Relazione con la tabella Stanze

    private String identificativo;
//enum
    private stati stato;

// TimeStamp Per vedere la creazione
    @CreationTimestamp
    private LocalDate creatoIl;

// TimeStamp Per vedere l'aggiornamento
    @UpdateTimestamp
    private LocalDate aggiornatoIl;

//JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
//Costruttore Vuoto JPA
    public Postazioni() {
    }

    // Costruttore
    public Postazioni(Long id_postazione, Long id_stanza, String identificativo, stati stato, LocalDate creatoIl,
            LocalDate aggiornatoIl) {
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
        this.identificativo = identificativo;
        this.stato = stato;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
    }

    // Setters And Getters
    public Long getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Long id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Long getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Long id_stanza) {
        this.id_stanza = id_stanza;
    }

    public String identificativo() {
        return identificativo;
    }

    public void setIdentificativo(String identificativo) {
        this.identificativo = identificativo;
    }

    public stati getStato() {
        return stato;
    }

    public void setStato(stati stato) {
        this.stato = stato;
    }

    public LocalDate getCreatoIl() {
        return creatoIl;
    }

    public LocalDate getAggiornatoIl() {
        return aggiornatoIl;
    }
}
