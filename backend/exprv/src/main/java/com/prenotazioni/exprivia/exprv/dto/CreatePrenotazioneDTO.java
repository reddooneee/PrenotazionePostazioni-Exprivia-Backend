package com.prenotazioni.exprivia.exprv.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class CreatePrenotazioneDTO {
    private Integer id_postazione;
    private Integer id_stanza;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime data_inizio;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime data_fine;

    public CreatePrenotazioneDTO() {
    }

    public CreatePrenotazioneDTO(Integer id_postazione, Integer id_stanza, LocalDateTime data_inizio, LocalDateTime data_fine) {
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
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