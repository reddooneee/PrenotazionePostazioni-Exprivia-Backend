package com.prenotazioni.exprivia.exprv.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Stanze {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id_stanza;

    private String nome;
    private String descrizione;
//Creato Il, Aggioranto il (TIMESTAMP)

//Costruttore
    public Stanze(String descrizione, Long id_stanza, String nome) {
        this.descrizione = descrizione;
        this.id_stanza = id_stanza;
        this.nome = nome;
    }

//Setters And Getters
    public Long getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Long id_stanza) {
        this.id_stanza = id_stanza;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

}
