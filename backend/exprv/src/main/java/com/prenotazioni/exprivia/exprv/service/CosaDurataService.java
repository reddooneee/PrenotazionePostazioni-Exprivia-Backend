package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prenotazioni.exprivia.exprv.dto.CosaDurataDTO;
import com.prenotazioni.exprivia.exprv.entity.CosaDurata;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.mapper.CosaDurataMapper;
import com.prenotazioni.exprivia.exprv.repository.CosaDurataRepository;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@Service
@Transactional
public class CosaDurataService {

    private final CosaDurataRepository cosaDurataRepository;
    private final PrenotazioniRepository prenotazioniRepository;
    private final CosaDurataMapper cosaDurataMapper;

    public CosaDurataService(
            CosaDurataRepository cosaDurataRepository,
            PrenotazioniRepository prenotazioniRepository,
            CosaDurataMapper cosaDurataMapper) {
        this.cosaDurataRepository = cosaDurataRepository;
        this.prenotazioniRepository = prenotazioniRepository;
        this.cosaDurataMapper = cosaDurataMapper;
    }

    public List<CosaDurataDTO> findAll() {
        return cosaDurataRepository.findAll().stream()
                .map(cosaDurataMapper::toDto)
                .toList();
    }

    public Optional<CosaDurataDTO> findOne(String nome) {
        return cosaDurataRepository.findById(nome)
                .map(cosaDurataMapper::toDto);
    }

    public List<CosaDurataDTO> searchByNome(String searchTerm) {
        return cosaDurataRepository.searchByNome(searchTerm).stream()
                .map(cosaDurataMapper::toDto)
                .toList();
    }

    public List<CosaDurataDTO> findByPrenotazioneId(Integer prenotazioneId) {
        return cosaDurataRepository.findByPrenotazioneId(prenotazioneId).stream()
                .map(cosaDurataMapper::toDto)
                .toList();
    }

    public CosaDurataDTO create(@Valid CosaDurataDTO cosaDurataDTO) {
        if (cosaDurataRepository.existsByNome(cosaDurataDTO.getNome())) {
            throw new IllegalArgumentException("Esiste già una cosa durata con questo nome");
        }

        CosaDurata cosaDurata = cosaDurataMapper.toEntity(cosaDurataDTO);
        if (cosaDurataDTO.getPrenotazioneIds() != null) {
            Set<Prenotazioni> prenotazioni = cosaDurataDTO.getPrenotazioneIds().stream()
                    .map(prenotazioniRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(java.util.stream.Collectors.toSet());
            cosaDurata.setPrenotazioni(prenotazioni);
        }
        cosaDurata = cosaDurataRepository.save(cosaDurata);
        return cosaDurataMapper.toDto(cosaDurata);
    }

    public Optional<CosaDurataDTO> update(String nome, @Valid CosaDurataDTO cosaDurataDTO) {
        return cosaDurataRepository.findById(nome)
                .map(existingCosaDurata -> {
                    if (!nome.equals(cosaDurataDTO.getNome()) && 
                        cosaDurataRepository.existsByNome(cosaDurataDTO.getNome())) {
                        throw new IllegalArgumentException("Esiste già una cosa durata con questo nome");
                    }

                    CosaDurata cosaDurata = cosaDurataMapper.toEntity(cosaDurataDTO);
                    if (cosaDurataDTO.getPrenotazioneIds() != null) {
                        Set<Prenotazioni> prenotazioni = cosaDurataDTO.getPrenotazioneIds().stream()
                                .map(prenotazioniRepository::findById)
                                .filter(Optional::isPresent)
                                .map(Optional::get)
                                .collect(java.util.stream.Collectors.toSet());
                        cosaDurata.setPrenotazioni(prenotazioni);
                    }
                    return cosaDurataMapper.toDto(cosaDurataRepository.save(cosaDurata));
                });
    }

    public void delete(String nome) {
        if (!cosaDurataRepository.existsById(nome)) {
            throw new EntityNotFoundException("Cosa durata non trovata con nome: " + nome);
        }
        cosaDurataRepository.deleteById(nome);
    }

    public long countByPrenotazioneId(Integer prenotazioneId) {
        return cosaDurataRepository.countByPrenotazioneId(prenotazioneId);
    }
} 