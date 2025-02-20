package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.cglib.core.Local;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Stanze {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id_stanza;

    private String nome;
    private String descrizione;

    @CreationTimestamp
    private LocalDate creatoIl;

    @CreationTimestamp
    private LocalDate aggiornatoIl;
//Creato Il, Aggioranto il (TIMESTAMP)

//Costruttore
    public Stanze(Long id_stanza, String descrizione, String nome, LocalDate creatoIl, LocalDate aggiorantoIl) {
        this.descrizione = descrizione;
        this.id_stanza = id_stanza;
        this.nome = nome;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiorantoIl;
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

    public LocalDate getCreatoIl(){
        return creatoIl;
    }

    public LocalDate getAggiornatoIl(){
        return aggiornatoIl;
    }
}
