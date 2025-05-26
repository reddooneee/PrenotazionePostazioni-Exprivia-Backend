package com.prenotazioni.exprivia.exprv.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Repository
public interface PrenotazioniRepository extends JpaRepository<Prenotazioni, Integer> {
    @Query("SELECT p FROM Prenotazioni p WHERE p.users.email = :email")
    List<Prenotazioni> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Prenotazioni p WHERE p.dataInizio BETWEEN :startDate AND :endDate")
    List<Prenotazioni> findByDataInizioBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Prenotazioni p WHERE p.postazione.id_postazione = :postazioneId " +
           "AND ((p.dataInizio BETWEEN :startTime AND :endTime) " +
           "OR (p.dataFine BETWEEN :startTime AND :endTime) " +
           "OR (:startTime BETWEEN p.dataInizio AND p.dataFine))")
    List<Prenotazioni> findOverlappingBookings(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("postazioneId") Integer postazioneId);
}
