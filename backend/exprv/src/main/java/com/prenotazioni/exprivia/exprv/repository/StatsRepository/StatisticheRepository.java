package com.prenotazioni.exprivia.exprv.repository.StatsRepository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Repository
public interface StatisticheRepository extends JpaRepository<Prenotazioni, Integer> {

    // OPPURE Opzione 2: Using native query with projection
    @Query(value = "SELECT DATE(data_inizio) as data_inizio, COUNT(*) as conteggio " +
            "FROM prenotazioni " +
            "WHERE data_inizio >= :data_inizio " +
            "GROUP BY DATE(data_inizio) " +
            "ORDER BY data_inizio ASC", nativeQuery = true)
    List<Object[]> contaPrenotazioniPerGiorno(@Param("data_inizio") LocalDateTime data_inizio);
}
