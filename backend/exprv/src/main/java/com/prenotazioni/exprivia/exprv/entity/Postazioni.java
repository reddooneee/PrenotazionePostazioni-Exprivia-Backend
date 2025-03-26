package com.prenotazioni.exprivia.exprv.entity;

//import LocalDateTime
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.stato_postazione;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Postazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    //@JsonProperty("id_postazione")
    //per specificare i nomi esatti che Jackson deve utilizzare durante la deserializzazione:
    private Integer id_postazione;

    //@JsonProperty("stanze")
    @ManyToOne
    @JoinColumn(name = "id_stanza", referencedColumnName = "id_stanza")
    private Stanze stanze; // Relazione con la tabella Stanze

    // enum (Disponibile,Occupato, Manutenzione)
    @Enumerated(EnumType.STRING)
    //@JsonProperty("stato_postazione")
    private stato_postazione stato_postazione;

    // TimeStamp Per vedere la creazione
    @CreationTimestamp
    @Column(name = "creatoil")
    private LocalDateTime creatoIl;

    // TimeStamp Per vedere l'aggiornamento
    @UpdateTimestamp
    @Column(name = "aggiornatoil")
    private LocalDateTime aggiornatoIl;

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze
    // delle entità tramite reflection
    // Costruttore Vuoto JPA
    public Postazioni() {
    }

    // Costruttore
    public Postazioni(Integer id_postazione, Stanze stanze, stato_postazione stato_postazione, LocalDateTime creatoIl, LocalDateTime aggiornatoIl) {
        this.id_postazione = id_postazione;
        this.stanze = stanze;
        this.stato_postazione = stato_postazione;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
    }

    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Stanze getstanze() {
        return stanze;
    }

    public void setstanze(Stanze stanze) {
        this.stanze = stanze;
    }

    public stato_postazione getStato_postazione() {
        return stato_postazione;
    }

    public void setStato_postazione(stato_postazione stato_postazione) {
        this.stato_postazione = stato_postazione;
    }

//TIMESTAMP
    public LocalDateTime getCreatoIl() {
        return creatoIl;
    }

    public void setCreatoIl(LocalDateTime creatoIl) {
        this.creatoIl = creatoIl;
    }

    public LocalDateTime getAggiornatoIl() {
        return aggiornatoIl;
    }

    public void setAggiornatoIl(LocalDateTime aggiornatoIl) {
        this.aggiornatoIl = aggiornatoIl;
    }

}
