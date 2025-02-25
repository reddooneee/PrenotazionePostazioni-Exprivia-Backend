package com.prenotazioni.exprivia.exprv.entity;

//import Enum Prenotazioni
import java.time.LocalDate;

import com.prenotazioni.exprivia.exprv.enumerati.stati_prenotazioni;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; //LocalDate Per Data Inizio E Data Fine
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Prenotazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id_prenotazioni;

    private Long id_user; //FK Chiave esterna che collega la prenotazione all'utente che l'ha effettuata.

    private Long id_postazione; //FK Chiave esterna che collega la prenotazione alla postazione prenotata.

    private stati_prenotazioni stato_prenotazioni;

    private LocalDate dataInizio;
    private LocalDate dataFine;

//Creato il e Aggiornato il;
//data_inizio, data_fine Da Aggiungere!!; 
//JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
//Costruttore Per JPa
    public Prenotazioni() {
    }

//Costruttore
    public Prenotazioni(Long id_prenotazioni, Long id_postazione, Long id_user, stati_prenotazioni stato_prenotazioni, LocalDate dataInizio, LocalDate dataFine) {
        this.id_prenotazioni = id_prenotazioni;
        this.id_postazione = id_postazione;
        this.id_user = id_user;
        this.stato_prenotazioni = stato_prenotazioni;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;

    }

//Setters And Getters
    public Long getId_prenotazioni() {
        return id_prenotazioni;
    }

    public void setId_prenotazioni(Long id_prenotazioni) {
        this.id_prenotazioni = id_prenotazioni;
    }

    public Long getId_user() {
        return id_user;
    }

    public void setId_user(Long id_user) {
        this.id_user = id_user;
    }

    public Long getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Long id_postazione) {
        this.id_postazione = id_postazione;
    }

    public stati_prenotazioni getStato_prenotazioni() {
        return stato_prenotazioni;
    }

    public void setStato_prenotazioni(stati_prenotazioni stato_prenotazioni) {
        this.stato_prenotazioni = stato_prenotazioni;
    }

    public void setDataIniziale(LocalDate dataInizio) {
        this.dataInizio = dataInizio;
    }

    public LocalDate getDataFinale() {
        return dataFine;
    }
}
