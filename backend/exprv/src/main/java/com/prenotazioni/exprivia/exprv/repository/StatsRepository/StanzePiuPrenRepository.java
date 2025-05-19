package com.prenotazioni.exprivia.exprv.repository.StatsRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Stanze;

@Repository
public interface StanzePiuPrenRepository extends JpaRepository<Stanze, Integer> {

    //
    @Query(value = "SELECT s.nome, COUNT(*) as numero_prenotazioni " +
            "FROM prenotazioni p " +
            "JOIN stanze s " +
            "ON p.id_stanza = s.id_stanza " +
            "GROUP BY s.nome " +
            "ORDER BY numero_prenotazioni DESC", nativeQuery = true)
    List<Object[]> stanzePiuPrenotate();
}
