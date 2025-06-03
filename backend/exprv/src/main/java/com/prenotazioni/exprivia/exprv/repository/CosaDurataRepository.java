package com.prenotazioni.exprivia.exprv.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.CosaDurata;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Repository
public interface CosaDurataRepository extends JpaRepository<CosaDurata, String> {
    Optional<CosaDurata> findByNome(String nome);
    boolean existsByNome(String nome);

    @Query("SELECT cd FROM CosaDurata cd JOIN cd.prenotazioni p WHERE p.id_prenotazioni = :prenotazioneId")
    List<CosaDurata> findByPrenotazioneId(@Param("prenotazioneId") Integer prenotazioneId);

    @Query("SELECT cd FROM CosaDurata cd WHERE cd.nome LIKE %:searchTerm%")
    List<CosaDurata> searchByNome(@Param("searchTerm") String searchTerm);

    @Query("SELECT COUNT(cd) FROM CosaDurata cd JOIN cd.prenotazioni p WHERE p.id_prenotazioni = :prenotazioneId")
    long countByPrenotazioneId(@Param("prenotazioneId") Integer prenotazioneId);
} 