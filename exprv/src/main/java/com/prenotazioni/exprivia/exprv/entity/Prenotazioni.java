package com.prenotazioni.exprivia.exprv.entity;

//import Enum Prenotazioni
import com.prenotazioni.exprivia.exprv.enumerati.stati_prenotazioni;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Prenotazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    private Long id_user; //FK Chiave esterna che collega la prenotazione all'utente che l'ha effettuata.

    private Long id_postazione; //FK Chiave esterna che collega la prenotazione alla postazione prenotata.

    private stati_prenotazioni stato_prenotazioni;

//Creato il e Aggiornato il;
//data_inizio, data_fine Da Aggiungere!!; 
//Costruttore
    public Prenotazioni(Long id, Long id_postazione, Long id_user, stati_prenotazioni stato_prenotazioni) {
        this.id = id;
        this.id_postazione = id_postazione;
        this.id_user = id_user;
        this.stato_prenotazioni = stato_prenotazioni;
    }

//Setters And Getters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

}
