package com.prenotazioni.exprivia.exprv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prenotazioni.exprivia.exprv.entity.Prenotazione;

public interface PrenotazioneRepository extends JpaRepository<Prenotazione, Integer>{
    
}
