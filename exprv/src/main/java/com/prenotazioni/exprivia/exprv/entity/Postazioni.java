package com.prenotazioni.exprivia.exprv.entity;

//import enum
import com.prenotazioni.exprivia.exprv.enumerati.stati;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Postazioni {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private String id_postazione;

    private String id_stanza; //Relazione con la tabella Stanze

    private String nome;

    private stati stato;

//Time Stamp "CREATO IL","AGGIORNATO IL"
//Costruttore
    public Postazioni(String id_postazione, String id_stanza, String nome, stati stato) {
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
        this.nome = nome;
        this.stato = stato;
    }

//Setters And Getters
    public String getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(String id_postazione) {
        this.id_postazione = id_postazione;
    }

    public String getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(String id_stanza) {
        this.id_stanza = id_stanza;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public stati getStato() {
        return stato;
    }

    public void setStato(stati stato) {
        this.stato = stato;
    }

}
