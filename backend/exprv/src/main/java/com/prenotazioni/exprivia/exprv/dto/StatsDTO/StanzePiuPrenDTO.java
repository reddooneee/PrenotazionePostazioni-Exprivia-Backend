package com.prenotazioni.exprivia.exprv.dto.StatsDTO;

public class StanzePiuPrenDTO {

    private String nome;
    private int numero_postazioni;

    public StanzePiuPrenDTO(String nome, int numero_postazioni) {
        this.nome = nome;
        this.numero_postazioni = numero_postazioni;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getNumero_postazioni() {
        return numero_postazioni;
    }

    public void setNumero_postazioni(int numero_postazioni) {
        this.numero_postazioni = numero_postazioni;
    }

}
