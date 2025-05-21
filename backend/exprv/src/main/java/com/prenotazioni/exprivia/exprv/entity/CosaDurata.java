package com.prenotazioni.exprivia.exprv.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "cosadurata")
public class CosaDurata implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "cosadurata_name", length = 100)
    @NotNull
    @Size(max = 100)
    private String nome;

    @ManyToMany
    @JoinTable(name = "cosadurata_prenotazione", joinColumns = @JoinColumn(name = "cosadurata_name"), inverseJoinColumns = @JoinColumn(name = "prenotazione_id"))
    private Set<Prenotazioni> prenotazioni = new HashSet<>();

    // Costruttori
    public CosaDurata() {
    }

    public CosaDurata(String nome) {
        this.nome = nome;
    }

    // Getter e Setter
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Prenotazioni> getPrenotazioni() {
        return prenotazioni;
    }

    public void setPrenotazioni(Set<Prenotazioni> prenotazioni) {
        this.prenotazioni = prenotazioni;
    }

    // Pattern builder
    public CosaDurata nome(String nome) {
        this.nome = nome;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CosaDurata))
            return false;
        CosaDurata that = (CosaDurata) o;
        return Objects.equals(nome, that.nome);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome);
    }

    @Override
    public String toString() {
        return "CosaDurata{nome='" + nome + "'}";
    }
}