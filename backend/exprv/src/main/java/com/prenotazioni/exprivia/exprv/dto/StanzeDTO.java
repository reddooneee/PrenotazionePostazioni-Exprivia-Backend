package com.prenotazioni.exprivia.exprv.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.enumerati.tipo_stanza;

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id_stanza"
)
public class StanzeDTO {
    
    private Integer id_stanza;
    private Integer capacita_stanza;
    private String nome;
    private List<Postazioni> postazioni = new ArrayList<>();
    private tipo_stanza tipo_stanza;
    
    //Costruttore vuoto
    public StanzeDTO(){}

    //Costruttore pieno
    public StanzeDTO(Integer id_stanza, Integer capacita_stanza, String nome, tipo_stanza tipo_stanza){
        this.id_stanza = id_stanza;
        this.capacita_stanza = capacita_stanza;
        this.nome = nome;
        this.tipo_stanza = tipo_stanza;
    }

    public Integer getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Integer id_stanza) {
        this.id_stanza = id_stanza;
    }

    public Integer getCapacita_stanza() {
        return capacita_stanza;
    }

    public void setCapacita_stanza(Integer capacita_stanza) {
        this.capacita_stanza = capacita_stanza;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Postazioni> getPostazioni() {
        return postazioni;
    }

    public void setPostazioni(List<Postazioni> postazioni) {
        this.postazioni = postazioni;
    }

    public tipo_stanza getTipo_stanza() {
        return tipo_stanza;
    }

    public void setTipo_stanza(tipo_stanza tipo_stanza) {
        this.tipo_stanza = tipo_stanza;
    }

    //Getter e Setter
    
}
