package com.prenotazioni.exprivia.exprv.enumerati;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum stato_prenotazione {

    Confermata,
    Sospesa,
    Annullata;

    @JsonCreator
    public static stato_prenotazione fromString(String value) {
        for (stato_prenotazione stato : stato_prenotazione.values()) {
            if (stato.name().equalsIgnoreCase(value)) {
                return stato;
            }
        }
        throw new IllegalArgumentException("Valore enum sbagliato: " + value);
    }
}
