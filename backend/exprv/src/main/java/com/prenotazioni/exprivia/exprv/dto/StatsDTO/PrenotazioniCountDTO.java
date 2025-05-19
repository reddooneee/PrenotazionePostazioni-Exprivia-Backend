package com.prenotazioni.exprivia.exprv.dto.StatsDTO;

import java.time.LocalDateTime;

public class PrenotazioniCountDTO {

    private LocalDateTime data_inizio;
    private int conteggio;

    public PrenotazioniCountDTO(LocalDateTime data_inzio, int conteggio) {
        this.data_inizio = data_inzio;
        this.conteggio = conteggio;
    }

    public LocalDateTime getData_inizio() {
        return data_inizio;
    }

    public void setData_inizio(LocalDateTime data_inizio) {
        this.data_inizio = data_inizio;
    }

    public int getConteggio() {
        return conteggio;
    }

    public void setConteggio(int conteggio) {
        this.conteggio = conteggio;
    }

}
