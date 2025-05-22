package com.prenotazioni.exprivia.exprv.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrenotazioniDTO {

    private Integer id_prenotazioni;
    
    // Per la creazione usiamo gli ID
    private Integer id_user;
    private Integer id_postazione;
    private Integer id_stanza;
    
    // Per le risposte includiamo gli oggetti completi
    private Users users;
    private Postazioni postazione;
    private Stanze stanze;

    private stato_prenotazione stato_prenotazione;
    private LocalDateTime data_inizio;
    private LocalDateTime data_fine;

    public PrenotazioniDTO() {
    }

    // Costruttore per la creazione
    public PrenotazioniDTO(Integer id_user, Integer id_postazione, Integer id_stanza,
            LocalDateTime data_inizio, LocalDateTime data_fine) {
        this.id_user = id_user;
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
    }

    // Costruttore completo per le risposte
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

    // Getters e Setters per gli ID
    public Integer getId_user() {
        return id_user;
    }

    public void setId_user(Integer id_user) {
        this.id_user = id_user;
    }

    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Integer getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Integer id_stanza) {
        this.id_stanza = id_stanza;
    }

    // Getters e Setters esistenti
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
