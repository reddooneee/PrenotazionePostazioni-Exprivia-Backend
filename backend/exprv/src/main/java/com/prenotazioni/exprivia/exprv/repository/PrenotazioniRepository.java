package com.prenotazioni.exprivia.exprv.repository;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Repository
public interface PrenotazioniRepository extends JpaRepository<Prenotazioni, Integer> {
    @Query("SELECT DISTINCT p FROM Prenotazioni p " +
           "LEFT JOIN FETCH p.users u " +
           "LEFT JOIN FETCH u.authorities " +
           "LEFT JOIN FETCH p.postazione po " +
           "LEFT JOIN FETCH p.stanze s " +
           "LEFT JOIN FETCH p.coseDurata " +
           "WHERE u.email = :email " +
           "ORDER BY p.dataInizio DESC")
    List<Prenotazioni> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Prenotazioni p WHERE p.dataInizio BETWEEN :startDate AND :endDate")
    List<Prenotazioni> findByDataInizioBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Prenotazioni p WHERE p.postazione.id_postazione = :postazioneId " +
           "AND p.stato_prenotazione != 'Annullata' " +
           "AND (p.dataInizio < :endTime AND p.dataFine > :startTime)")
    List<Prenotazioni> findOverlappingBookings(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("postazioneId") Integer postazioneId);

    @Query("SELECT p FROM Prenotazioni p WHERE DATE(p.dataInizio) = DATE(:giorno)")
    List<Prenotazioni> findByDataInizioOnDay(@Param("giorno") LocalDate giorno);

    @Query("SELECT p FROM Prenotazioni p WHERE DATE(p.dataInizio) = DATE(:giorno) AND p.postazione.id_postazione = :postazioneId AND p.stato_prenotazione != 'Annullata'")
    List<Prenotazioni> findByDataInizioOnDayAndPostazione(@Param("giorno") LocalDate giorno, @Param("postazioneId") Integer postazioneId);
}
