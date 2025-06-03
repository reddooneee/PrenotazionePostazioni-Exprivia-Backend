package com.prenotazioni.exprivia.exprv.dto;

import java.io.Serializable;
import java.util.Set;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CosaDurataDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Size(max = 100)
    private String nome;

    private Set<Integer> prenotazioneIds;

    // Costruttori
    public CosaDurataDTO() {
    }

    public CosaDurataDTO(String nome, Set<Integer> prenotazioneIds) {
        this.nome = nome;
        this.prenotazioneIds = prenotazioneIds;
    }

    // Getter e Setter
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Integer> getPrenotazioneIds() {
        return prenotazioneIds;
    }

    public void setPrenotazioneIds(Set<Integer> prenotazioneIds) {
        this.prenotazioneIds = prenotazioneIds;
    }

    // Pattern builder
    public CosaDurataDTO nome(String nome) {
        this.nome = nome;
        return this;
    }

    public CosaDurataDTO prenotazioneIds(Set<Integer> prenotazioneIds) {
        this.prenotazioneIds = prenotazioneIds;
        return this;
    }
} 