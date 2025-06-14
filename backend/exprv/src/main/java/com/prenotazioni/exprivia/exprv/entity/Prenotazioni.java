package com.prenotazioni.exprivia.exprv.entity;

//import Enum Prenotazioni
import java.time.LocalDateTime;
import java.util.HashSet;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "prenotazioni")
public class Prenotazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_prenotazione")
    private Integer id_prenotazioni;

    @ManyToOne
    @JoinColumn(name = "id_user", referencedColumnName = "id_user")
    private Users users;

    @ManyToOne
    @JoinColumn(name = "id_postazione", referencedColumnName = "id_postazione")
    private Postazioni postazione;

    @ManyToOne
    @JoinColumn(name = "id_stanza", referencedColumnName = "id_stanza")
    private Stanze stanze;

    @Enumerated(EnumType.STRING)
    private stato_prenotazione stato_prenotazione;

    @Column(name = "data_inizio")
    private LocalDateTime dataInizio;

    @Column(name = "data_fine")
    private LocalDateTime dataFine;

    @ManyToMany(mappedBy = "prenotazioni")
    @JsonIgnore
    private Set<CosaDurata> coseDurata = new HashSet<>();

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze
    // delle entità tramite reflection

    // Costruttore Per JPa

    public Prenotazioni() {
    }

    // Costruttore
    public Prenotazioni(Integer id_prenotazioni, Users users, Postazioni postazione, Stanze stanze,
            stato_prenotazione stato_prenotazione, LocalDateTime dataInizio, LocalDateTime dataFine) {
        this.id_prenotazioni = id_prenotazioni;
        this.users = users;
        this.postazione = postazione;
        this.stanze = stanze;
        this.stato_prenotazione = stato_prenotazione;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
    }

    // Getters and Setters

    public Integer getId_prenotazioni() {
        return id_prenotazioni;
    }

    public void setId_prenotazioni(Integer id_prenotazioni) {
        this.id_prenotazioni = id_prenotazioni;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Postazioni getPostazione() {
        return postazione;
    }

    public void setPostazione(Postazioni postazione) {
        this.postazione = postazione;
    }

    public Stanze getStanze() {
        return stanze;
    }

    public void setStanze(Stanze stanze) {
        this.stanze = stanze;
    }

    public stato_prenotazione getStato_prenotazione() {
        return stato_prenotazione;
    }

    public void setStato_prenotazione(stato_prenotazione stato_prenotazione) {
        this.stato_prenotazione = stato_prenotazione;
    }

    public LocalDateTime getDataInizio() {
        return dataInizio;
    }

    public void setDataInizio(LocalDateTime dataInizio) {
        this.dataInizio = dataInizio;
    }

    public LocalDateTime getDataFine() {
        return dataFine;
    }

    public void setDataFine(LocalDateTime dataFine) {
        this.dataFine = dataFine;
    }

    public Set<CosaDurata> getCoseDurata() {
        return coseDurata;
    }

    public void setCoseDurata(Set<CosaDurata> coseDurata) {
        this.coseDurata = coseDurata;
    }
}
