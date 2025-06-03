package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.prenotazioni.exprivia.exprv.enumerati.tipo_stanza;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id_stanza"
)
public class Stanze {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_stanza;

    // @Column(length = 50)
    private String nome;

    @OneToMany(mappedBy = "stanze", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Postazioni> postazioni = new ArrayList<>();

    @OneToMany(mappedBy = "stanze")
    private List<Prenotazioni> prenotazioni = new ArrayList<>();

    // Enum tipo_stanza (MeetingRoom, OpenSpace, Ufficio)
    @Enumerated(EnumType.STRING)
    private tipo_stanza tipo_stanza;

    private Integer capacita_stanza;

    @CreationTimestamp
    @Column(name = "creatoil")
    private LocalDateTime creatoIl;

    @CreationTimestamp
    @Column(name = "aggiornatoil")
    private LocalDateTime aggiornatoIl;
    // Creato Il, Aggioranto il (TIMESTAMP)

    // JPA richiede un costruttore senza argomenti affinché possa creare istanze
    // delle entità tramite reflection
    // Costruttore Vuoto - Per Jpa
    public Stanze() {
    }

    public Stanze(Integer id_stanza) {
        this.id_stanza = id_stanza;
    }

    // Costruttore Con Argomenti
    public Stanze(Integer id_stanza, String nome, tipo_stanza tipo_stanza, Integer capacita_stanza,
            LocalDateTime creatoIl,
            LocalDateTime aggiornatoIl) {
        this.id_stanza = id_stanza;
        this.nome = nome;
        this.tipo_stanza = tipo_stanza;
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

    public void setTipo_stanza(tipo_stanza tipo_stanza) {
        this.tipo_stanza = tipo_stanza;
    }

    public tipo_stanza getTipo_stanza() {
        return tipo_stanza;
    }

    public Integer getCapacita_stanza() {
        return capacita_stanza;
    }

    public void setCapacita_stanza(Integer capacita_stanza) {
        this.capacita_stanza = capacita_stanza;
    }

    // Getters e Setters
    public List<Postazioni> getPostazioni() {
        return postazioni;
    }

    public void setPostazioni(List<Postazioni> postazioni) {
        this.postazioni = postazioni;
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
