package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Stanze {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_stanza;

    //@Column(length = 50)
    private String nome;

    private String descrizione;

    private Integer capacita_stanza;

    //Enum per tipo_stanza
    //private 
    @CreationTimestamp
    @Column(name = "creatoil")
    private LocalDateTime creatoIl;

    @CreationTimestamp
    @Column(name = "aggiornatoil")
    private LocalDateTime aggiornatoIl;
//Creato Il, Aggioranto il (TIMESTAMP)

//JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
//Costruttore Vuoto - Per Jpa
    public Stanze() {
    }

    //Costruttore Con Argomenti
    public Stanze(Integer id_stanza, String nome, String descrizione, Integer capacita_stanza, LocalDateTime creatoIl,
            LocalDateTime aggiornatoIl) {
        this.id_stanza = id_stanza;
        this.nome = nome;
        this.descrizione = descrizione;
        this.capacita_stanza = capacita_stanza;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
    }

    public Integer getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Integer id_stanza) {
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

    public Integer getCapacita_stanza() {
        return capacita_stanza;
    }

    public void setCapacita_stanza(Integer capacita_stanza) {
        this.capacita_stanza = capacita_stanza;
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
