package com.prenotazioni.exprivia.exprv.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
//import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.StatoPostazione;

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id_postazione"
)
public class PostazioniDTO {

    private Integer id_postazione;
    private String nomePostazione;
    private Integer id_stanza; // Solo l'ID invece dell'oggetto intero
    private LocalDateTime creatoIl;
    private LocalDateTime aggiornatoIl;

    @JsonProperty("StatoPostazione")
    private StatoPostazione statoPostazione;

    // Costruttore vuoto
    public PostazioniDTO() {
    }

    // Costruttore con parametri
    public PostazioniDTO(Integer id_postazione, String nomePostazione, Integer id_stanza, LocalDateTime creatoIl,
            LocalDateTime aggiornatoIl) {
        this.id_postazione = id_postazione;
        this.nomePostazione = nomePostazione;
        this.id_stanza = id_stanza;
        this.creatoIl = creatoIl;
        this.aggiornatoIl = aggiornatoIl;
    }

    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public String getNomePostazione() {
        return nomePostazione;
    }

    public void setNomePostazione(String nomePostazione) {
        this.nomePostazione = nomePostazione;
    }

    public Integer getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Integer id_stanza) {
        this.id_stanza = id_stanza;
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

    public StatoPostazione getStatoPostazione() {
        return statoPostazione;
    }

    public void setStatoPostazione(StatoPostazione statoPostazione) {
        this.statoPostazione = statoPostazione;
    }

}