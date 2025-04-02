package com.prenotazioni.exprivia.exprv.dto;

import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.enumerati.stato_postazione;

public class PostazioniDTO {
 
    private Integer id_postazione;
    private Stanze stanze;
    private stato_postazione stato_postazione;
    
    public PostazioniDTO(){}

    public PostazioniDTO(Integer id_postazione, Stanze stanze, stato_postazione stato_postazione){
        this.id_postazione = id_postazione;
        this.stanze = stanze;
        this.stato_postazione = stato_postazione;
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

    public stato_postazione getStato_postazione() {
        return stato_postazione;
    }

    public void setStato_postazione(stato_postazione stato_postazione) {
        this.stato_postazione = stato_postazione;
    }

}