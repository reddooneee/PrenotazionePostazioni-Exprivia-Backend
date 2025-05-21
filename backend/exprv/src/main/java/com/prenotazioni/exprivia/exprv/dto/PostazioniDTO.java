package com.prenotazioni.exprivia.exprv.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.StatoPostazione;

public class PostazioniDTO {

    private Integer id_postazione;
    private Stanze stanze;

    @JsonProperty("StatoPostazione")
    private StatoPostazione statoPostazione;

    public PostazioniDTO() {
    }

    public PostazioniDTO(Integer id_postazione, Stanze stanze, StatoPostazione statoPostazione) {
        this.id_postazione = id_postazione;
        this.stanze = stanze;
        this.statoPostazione = statoPostazione;
    }

    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Stanze getStanze() {
        return stanze;
    }

    public void setStanze(Stanze stanze) {
        this.stanze = stanze;
    }

    public StatoPostazione getStatoPostazione() {
        return statoPostazione;
    }

    public void setStatoPostazione(StatoPostazione statoPostazione) {
        this.statoPostazione = statoPostazione;
    }

}