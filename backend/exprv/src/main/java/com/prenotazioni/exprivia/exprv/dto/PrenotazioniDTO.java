package com.prenotazioni.exprivia.exprv.dto;

import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;

public class PrenotazioniDTO {
    
    private Integer id_prenotazioni;
    private Users users;
    private Postazioni postazione;
    private Stanze stanze;
    private stato_prenotazione stato_prenotazione;

    public PrenotazioniDTO(){}

    public PrenotazioniDTO(Integer id_prenotazioni, Users users, Postazioni postazione, Stanze stanze, stato_prenotazione stato_prenotazione){
        this.id_prenotazioni = id_prenotazioni;
        this.users = users;
        this.postazione = postazione;
        this.stanze = stanze;
        this.stato_prenotazione = stato_prenotazione;
    }

    public Integer getId_prenotazioni() {
        return id_prenotazioni;
    }

    public void setId_prenotazioni(Integer id_prenotazioni) {
        this.id_prenotazioni = id_prenotazioni;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Postazioni getPostazione() {
        return postazione;
    }

    public void setPostazione(Postazioni postazione) {
        this.postazione = postazione;
    }

    public Stanze getStanze() {
        return stanze;
    }

    public void setStanze(Stanze stanze) {
        this.stanze = stanze;
    }

    public stato_prenotazione getStato_prenotazione() {
        return stato_prenotazione;
    }

    public void setStato_prenotazione(stato_prenotazione stato_prenotazione) {
        this.stato_prenotazione = stato_prenotazione;
    }

    
}
