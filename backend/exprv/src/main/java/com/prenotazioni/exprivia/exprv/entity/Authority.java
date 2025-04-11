package com.prenotazioni.exprivia.exprv.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "authority")
public class Authority implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "authority_name", length = 50, nullable = false)
    @NotNull
    @Size(max = 50)
    private String name;

    // Costruttori
    public Authority() {
    }

    public Authority(String name) {
        this.name = name;
    }

    // Getter e Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Pattern builder per catene fluenti
    public Authority name(String name) {
        this.name = name;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Authority authority = (Authority) o;
        return Objects.equals(name, authority.name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }

    @Override
    public String toString() {
        return "Authority{name='" + name + "'}";
    }
}

