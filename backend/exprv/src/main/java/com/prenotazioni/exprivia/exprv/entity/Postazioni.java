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
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id_postazione"
)
public class Postazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    // @JsonProperty("id_postazione")
    // per specificare i nomi esatti che Jackson deve utilizzare durante la
    // deserializzazione:
    private Integer id_postazione;

    // Relazione Per Stato Postazione
    @ManyToOne
    @JoinColumn(name = "stato_postazione_name")
    @JsonBackReference
    private StatoPostazione statoPostazione;

    // @JsonProperty("stanze")
    @ManyToOne
    @JoinColumn(name = "id_stanza", referencedColumnName = "id_stanza")
    @JsonBackReference
    private Stanze stanze; // Relazione con la tabella Stanze

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

    // Costruttore
    public Postazioni(Integer id_postazione, Stanze stanze, StatoPostazione statoPostazione, LocalDateTime creatoIl,
            LocalDateTime aggiornatoIl, String nomePostazione) {
        this.id_postazione = id_postazione;
        this.stanze = stanze;
        this.statoPostazione = statoPostazione;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
        this.nomePostazione = nomePostazione;
    }

    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Stanze getStanze() {
        return stanze;
    }

    public void setstanze(Stanze stanze) {
        this.stanze = stanze;
    }

    public StatoPostazione getStatoPostazione() {
        return statoPostazione;
    }

    public void setStatoPostazione(StatoPostazione statoPostazione) {
        this.statoPostazione = statoPostazione;
    }

    // TIMESTAMP
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

    public String getNomePostazione() {
        return nomePostazione;
    }

    public void setNomePostazione(String nomePostazione) {
        this.nomePostazione = nomePostazione;
    }

    public List<Prenotazioni> getPrenotazioni() {
        return prenotazioni;
    }

    public void setPrenotazioni(List<Prenotazioni> prenotazioni) {
        this.prenotazioni = prenotazioni;
    }
}
