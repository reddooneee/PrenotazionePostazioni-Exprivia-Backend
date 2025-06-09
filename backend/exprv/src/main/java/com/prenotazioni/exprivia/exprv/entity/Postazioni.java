package com.prenotazioni.exprivia.exprv.entity;

//import LocalDateTime
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Postazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_postazione;

    // Relazione Per Stato Postazione
    @ManyToOne
    @JoinColumn(name = "stato_postazione_name")
    @JsonIgnore
    private StatoPostazione statoPostazione;

    @ManyToOne
    @JoinColumn(name = "id_stanza", referencedColumnName = "id_stanza")
    @JsonIgnore
    private Stanze stanze;

    @OneToMany(mappedBy = "postazione")
    @JsonIgnore
    private List<Prenotazioni> prenotazioni = new ArrayList<>();

    @Column(name = "nome")
    private String nomePostazione;

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

    // Costruttore che accetta solo id
    @JsonCreator
    public Postazioni(@JsonProperty("id_postazione") Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    // Costruttore completo
    public Postazioni(Integer id_postazione, String nomePostazione, StatoPostazione statoPostazione, 
                     Stanze stanze, LocalDateTime creatoIl, LocalDateTime aggiornatoIl) {
        this.id_postazione = id_postazione;
        this.nomePostazione = nomePostazione;
        this.statoPostazione = statoPostazione;
        this.stanze = stanze;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
    }

    // Getters and Setters
    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public String getNomePostazione() {
        return nomePostazione;
    }

    public void setNomePostazione(String nomePostazione) {
        this.nomePostazione = nomePostazione;
    }

    public StatoPostazione getStatoPostazione() {
        return statoPostazione;
    }

    public void setStatoPostazione(StatoPostazione statoPostazione) {
        this.statoPostazione = statoPostazione;
    }

    public Stanze getStanze() {
        return stanze;
    }

    public void setStanze(Stanze stanze) {
        this.stanze = stanze;
    }

    public List<Prenotazioni> getPrenotazioni() {
        return prenotazioni;
    }

    public void setPrenotazioni(List<Prenotazioni> prenotazioni) {
        this.prenotazioni = prenotazioni;
    }

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
