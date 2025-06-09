package com.prenotazioni.exprivia.exprv.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class AdminCreatePrenotazioneDTO {
    private Integer id_postazione;
    private Integer id_stanza;
    private Integer id_user; // Required for admin bookings
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime data_inizio;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime data_fine;

    public AdminCreatePrenotazioneDTO() {
    }

    public AdminCreatePrenotazioneDTO(Integer id_postazione, Integer id_stanza, Integer id_user, LocalDateTime data_inizio, LocalDateTime data_fine) {
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
        this.id_user = id_user;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
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

    public Integer getId_user() {
        return id_user;
    }

    public void setId_user(Integer id_user) {
        this.id_user = id_user;
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