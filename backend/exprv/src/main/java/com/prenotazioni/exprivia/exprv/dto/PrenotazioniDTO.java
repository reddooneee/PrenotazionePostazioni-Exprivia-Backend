package com.prenotazioni.exprivia.exprv.dto;

import java.time.LocalDateTime;

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
    private LocalDateTime data_inizio;
    private LocalDateTime data_fine;

    public PrenotazioniDTO() {
    }

    public PrenotazioniDTO(Integer id_prenotazioni, Users users, Postazioni postazione, Stanze stanze,
            stato_prenotazione stato_prenotazione, LocalDateTime data_inizio, LocalDateTime data_fine) {
        this.id_prenotazioni = id_prenotazioni;
        this.users = users;
        this.postazione = postazione;
        this.stanze = stanze;
        this.stato_prenotazione = stato_prenotazione;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
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

    public LocalDateTime getData_inizio() {
        return data_inizio;
    }

    public void setData_inizio(LocalDateTime data_inizio) {
        this.data_inizio = data_inizio;
    }

    public LocalDateTime getData_fine() {
        return data_fine;
    }

    public void setData_fine(LocalDateTime data_fine) {
        this.data_fine = data_fine;
    }

}
