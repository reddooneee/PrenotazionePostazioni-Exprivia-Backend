package com.prenotazioni.exprivia.exprv.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Stanze {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id_stanza;

    private String nome;
    private String descrizione;

    private Integer capacita_stanza;
    
    //Enum per tipo_stanza
    //private 

    @CreationTimestamp
    private LocalDateTime creatoIl;

    @CreationTimestamp
    private LocalDateTime aggiornatoIl;
//Creato Il, Aggioranto il (TIMESTAMP)

//JPA richiede un costruttore senza argomenti affinché possa creare istanze delle entità tramite reflection
//Costruttore Vuoto - Per Jpa
    public Stanze() {
    }

//Costruttore Con Argomenti

}
