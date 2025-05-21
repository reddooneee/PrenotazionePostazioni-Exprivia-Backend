package com.prenotazioni.exprivia.exprv.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "stato_postazione")
public class StatoPostazione implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "stato_postazione_name", length = 50, nullable = false)
    @NotNull
    @Size(max = 50)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "statoPostazione")
    @JsonManagedReference
    private Set<Postazioni> postazioni = new HashSet<>();

    // Costruttori
    public StatoPostazione() {
    }

    public StatoPostazione(String name) {
        this.name = name;
    }

    // Getter e Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Postazioni> getPostazioni() {
        return postazioni;
    }

    public void setPostazioni(Set<Postazioni> postazioni) {
        this.postazioni = postazioni;
    }

    // Pattern builder
    public StatoPostazione name(String name) {
        this.name = name;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof StatoPostazione))
            return false;
        StatoPostazione that = (StatoPostazione) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "StatoPostazione{name='" + name + "'}";
    }
}