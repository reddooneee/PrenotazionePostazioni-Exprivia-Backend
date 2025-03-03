package com.prenotazioni.exprivia.exprv.entity;

//import LocalDateTime
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.stati;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Postazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_postazione;

    private Integer id_stanza; // Relazione con la tabella Stanze

    
    // enum
    @Enumerated(EnumType.STRING)
    private stati stato;

    // TimeStamp Per vedere la creazione
    @CreationTimestamp
    private LocalDateTime creatoIl;

    // TimeStamp Per vedere l'aggiornamento
    @UpdateTimestamp
    private LocalDateTime aggiornatoIl;

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze
    // delle entità tramite reflection
    // Costruttore Vuoto JPA
    public Postazioni() {
    }

    // Costruttore
    public Postazioni(Integer id_postazione, Integer id_stanza, stati stato, LocalDateTime creatoIl,
            LocalDateTime aggiornatoIl) {
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
        this.stato = stato;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
    }

    // Setters And Getters
    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Integer getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Integer id_stanza) {
        this.id_stanza = id_stanza;
    }

    public stati getStato() {
        return stato;
    }

    public void setStato(stati stato) {
        this.stato = stato;
    }

    public LocalDateTime getCreatoIl() {
        return creatoIl;
    }

    public LocalDateTime getAggiornatoIl() {
        return aggiornatoIl;
    }

}
