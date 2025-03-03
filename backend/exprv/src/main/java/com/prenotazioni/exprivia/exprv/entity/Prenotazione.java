package com.prenotazioni.exprivia.exprv.entity;

//import Enum Prenotazioni
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prenotazioni.exprivia.exprv.enumerati.stati_prenotazioni;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Prenotazione {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_prenotazioni;

    @ManyToOne  //Si passano gli oggetti interi, non solo delle variabili 
    @JoinColumn(name = "id_user", referencedColumnName = "id_user")
    private Users users; //FK Chiave esterna che collega la prenotazione all'utente che l'ha effettuata.

    @ManyToOne
    @JoinColumn(name = "id_postazione", referencedColumnName = "id_postazione")
    private Postazioni postazione; //FK Chiave esterna che collega la prenotazione alla postazione prenotata.

    @ManyToOne
    @JoinColumn(name = "id_stanza", referencedColumnName = "id_stanza")    
    private Stanze stanze;   //FK Chiave esterna che collega la prenotazione alla stanza prenotata.

    @Enumerated(EnumType.STRING)
    private stati_prenotazioni stato_prenotazioni;

    @CreationTimestamp
    private LocalDateTime dataInizio;

    @UpdateTimestamp
    private LocalDateTime dataFine;

//Creato il e Aggiornato il;
//data_inizio, data_fine Da Aggiungere!!; 
//JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
//Costruttore Per JPa
    public Prenotazione() {
    }

//Costruttore
public Prenotazione(Integer id_prenotazioni, Users users, Postazioni postazione, Stanze stanze, stati_prenotazioni stato_prenotazioni, LocalDateTime dataInizio, LocalDateTime dataFine) {
    this.id_prenotazioni = id_prenotazioni;
    this.users = users;
    this.postazione = postazione;
    this.stanze = stanze;
    this.stato_prenotazioni = stato_prenotazioni;
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

    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

    public Postazioni getPostazione() {
        return postazione;
    }

    public void setPostazione(Postazioni postazione) {
        this.postazione = postazione;
    }

    public Stanze getStanza() {
        return stanze;
    }

    public void setStanza(Stanze stanza) {
        this.stanze = stanza;
    }

    public stati_prenotazioni getStato_prenotazioni() {
        return stato_prenotazioni;
    }

    public void setStato_prenotazioni(stati_prenotazioni stato_prenotazioni) {
        this.stato_prenotazioni = stato_prenotazioni;
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

}