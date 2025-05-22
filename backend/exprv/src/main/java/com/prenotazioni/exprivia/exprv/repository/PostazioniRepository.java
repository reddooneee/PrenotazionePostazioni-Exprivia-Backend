package com.prenotazioni.exprivia.exprv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Postazioni;

@Repository
public interface PostazioniRepository extends JpaRepository<Postazioni, Integer> {
    
    @Query("SELECT p FROM Postazioni p WHERE p.stanze.id_stanza = :stanzaId")
    List<Postazioni> findByStanzaId(@Param("stanzaId") Integer stanzaId);
}
