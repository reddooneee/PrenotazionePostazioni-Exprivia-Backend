package com.prenotazioni.exprivia.exprv.service;

import java.io.ByteArrayOutputStream;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;
import com.prenotazioni.exprivia.exprv.mapper.PrenotazioniMapper;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;
import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PrenotazioniService {

    @Autowired
    private PrenotazioniRepository prenotazioniRepository;

    @Autowired
    private PostazioniRepository postazioniRepository;

    @Autowired
    private StanzeRepository stanzeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrenotazioniMapper prenotazioniMapper;

    public PrenotazioniService() {
    }

    ;

    // Costruttore PrenotazioniService
    public PrenotazioniService(PrenotazioniRepository prenotazioniRepository,
            PostazioniRepository postazioniRepository,
            StanzeRepository stanzeRepository,
            UserRepository userRepository,
            PrenotazioniMapper prenotazioniMapper) {
        this.prenotazioniRepository = prenotazioniRepository;
        this.postazioniRepository = postazioniRepository;
        this.stanzeRepository = stanzeRepository;
        this.userRepository = userRepository;
        this.prenotazioniMapper = prenotazioniMapper;
    }

    /**
     * Valida i dati della Prenotazione e salva una nuova prenotazione se valida
     *
     * @param prenotazioniDTO dati da validare e salvare
     * @return prenotazioniDTO della prenotazione salvata
     * @throws IllegalArgumentException se i dati non sono validi
     */
    public void validatePrenotazioniDTO(PrenotazioniDTO prenotazioniDTO) {
        if (prenotazioniDTO.getStanze() == null) {
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if (prenotazioniDTO.getUsers() == null) {
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if (prenotazioniDTO.getStato_prenotazione() == null) {
            throw new IllegalArgumentException("Lo stato della Prenotazioni non può essere nullo!");
        }

        // Validazione orario di inizio
        LocalDateTime dataInizio = prenotazioniDTO.getData_inizio();
        if (dataInizio != null) {
            validateStartTime(dataInizio);
        } else {
            throw new IllegalArgumentException("La data di inizio non può essere nulla!");
        }
    }

    // findall Tutte le prenotazioni
    /*
     * Recupera tutte le prenotazioni dal DB
     * 
     * @return Lista di PrenotazioniDTO
     */
    public List<PrenotazioniDTO> cercaTutti() {
        List<Prenotazioni> prenotazioniList = prenotazioniRepository.findAll();
        return prenotazioniMapper.toDtoList(prenotazioniList);
    }

    // Ricerca singola tramite id ma con messaggino personalizzato invece che null
    /*
     * Recupera una prenotazione con l'id
     * 
     * @return Prenotazioni in base all'id
     */
    public PrenotazioniDTO cercaSingolo(Integer id) {
        Prenotazioni prenotazioni = prenotazioniRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazione con id " + id + " non trovato"));
        return prenotazioniMapper.toDto(prenotazioni);
    }

    // Creazione nuova Prenotazioni
    @Transactional
    public PrenotazioniDTO creaPrenotazioni(PrenotazioniDTO prenotazioniDTO) {

        validatePrenotazioniDTO(prenotazioniDTO);

        if (prenotazioniDTO.getId_prenotazioni() != null
                && prenotazioniRepository.existsById(prenotazioniDTO.getId_prenotazioni())) {
            throw new IllegalArgumentException("La Prenotazioni con ID "
                    + prenotazioniDTO.getId_prenotazioni() + " esiste già.");
        }

        // Conversione DTO in entity
        Prenotazioni prenotazioni = prenotazioniMapper.toEntity(prenotazioniDTO);

        // Salva L'utente
        Prenotazioni savedPrenotazioni = prenotazioniRepository.save(prenotazioni);

        // Restituisci il DTO dell'utente Salvato
        return prenotazioniMapper.toDto(savedPrenotazioni);
    }

    /**
     * Aggiorna una Prenotazione esistente con i valori specificati
     *
     * @param id      ID dell'utente da aggiornare
     * @param updates mappa dei campi da aggiornare
     * @return UserDTO dell'utente aggiornato
     * @throws EntityNotFoundException se l'utente non esiste
     */
    public PrenotazioniDTO updatePrenotazioni(Integer id, Map<String, Object> updates) {
        Prenotazioni existingPrenotazioni = prenotazioniRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prenotazione con ID " + id + " non trovata"));

        if (updates.containsKey("id")) {
            Integer newId = (Integer) updates.get("id_stanza");
            Optional<Prenotazioni> prenotazioneWithSameId = prenotazioniRepository.findById(newId);
            if (prenotazioneWithSameId.isPresent() && !prenotazioneWithSameId.get().getId_prenotazioni().equals(id)) {
                throw new IllegalArgumentException("id già in uso");
            }
        }

        updates.forEach((key, value) -> {
            switch (key) {
                case "stato_prenotazione":
                    existingPrenotazioni.setStato_prenotazione(stato_prenotazione.valueOf(value.toString()));
                    break;
                case "dataInizio":
                    existingPrenotazioni.setDataInizio(LocalDateTime.parse(value.toString()));
                    break;
                case "dataFine":
                    existingPrenotazioni.setDataFine(LocalDateTime.parse(value.toString()));
                    break;
                case "postazione":
                    Integer idPostazione = (Integer) value;
                    Postazioni postazione = postazioniRepository.findById(idPostazione)
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Postazione con ID " + idPostazione + " non trovata"));
                    existingPrenotazioni.setPostazione(postazione);
                    break;
                case "user":
                    Integer idUser = (Integer) value;
                    Users user = userRepository.findById(idUser)
                            .orElseThrow(() -> new EntityNotFoundException("User con ID " + idUser + " non trovato"));
                    existingPrenotazioni.setUsers(user);
                    break;
                case "stanza":
                    Integer idStanza = (Integer) value;
                    Stanze stanza = stanzeRepository.findById(idStanza)
                            .orElseThrow(
                                    () -> new EntityNotFoundException("Stanza con ID " + idStanza + " non trovata"));
                    existingPrenotazioni.setStanze(stanza);
                    break;
            }
        });

        Prenotazioni updatedPrenotazioni = prenotazioniRepository.save(existingPrenotazioni);
        return prenotazioniMapper.toDto(updatedPrenotazioni);
    }

    // Metodo Per Eliminare le prenotazioni
    public void eliminaPrenotazioni(Integer id) {
        if (!prenotazioniRepository.existsById(id)) {
            throw new EntityNotFoundException("Prenotazioni con ID " + id + " non trovata.");
        } else {
            prenotazioniRepository.deleteById(id);
        }
    }

    public List<PrenotazioniDTO> cercaPrenotazioniUtente(String email) {
        List<Prenotazioni> prenotazioni = prenotazioniRepository.findByUserEmail(email);
        return prenotazioniMapper.toDtoList(prenotazioni);
    }

    /*
     * Validazione Della data di inizo e di fine di una prenotazione
     * 
     * @param startTime c
     * 
     * @return void (metodo per solo controllo)
     * 
     * @throw IllegalArgumentException
     * 
     */
    private void validateStartTime(LocalDateTime startTime) {
        // Verifica che l'orario sia dopo le 8:00
        int oraInizio = startTime.getHour();
        if (oraInizio < 8) {
            throw new IllegalArgumentException("Non è possibile prenotare prima delle 8:00!");
        }

        // Verifica che l'orario sia prima delle 18:00 (fine giornata lavorativa)
        if (oraInizio >= 18) {
            throw new IllegalArgumentException("Non è possibile prenotare dopo le 18:00!");
        }

        /*
         * // Verifica che la prenotazione non sia nel passato
         * if (startTime.isBefore(LocalDateTime.now())) {
         * throw new
         * IllegalArgumentException("Non è possibile effettuare prenotazioni nel passato!"
         * );
         * }
         */
        // Verifica che la prenotazione sia in un giorno lavorativo
        if (startTime.getDayOfWeek() == DayOfWeek.SATURDAY || startTime.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Le prenotazioni sono disponibili solo nei giorni lavorativi!");
        }
    }

    /*
     * 
     * Metodo per restituire le prenotazioni giornaliere
     * 
     * @param data
     * 
     * @return PrenotazioniDTO con le prenotazioni giornaliere
     * 
     * 
     */
    public List<PrenotazioniDTO> getPrenotazioniByDay(LocalDateTime data) {

        // Data inizio e fine Giorno
        LocalDateTime inizioGiornata = data.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime fineGiornata = data.withHour(23).withMinute(59).withSecond(59);

        List<Prenotazioni> prenotazioniGiornaliere = prenotazioniRepository.findByDataInizioBetween(inizioGiornata,
                fineGiornata);

        return prenotazioniMapper.toDtoList(prenotazioniGiornaliere);

    }

    public byte[] FileExcDaily(LocalDateTime data) {
        List<PrenotazioniDTO> prenotazioni = getPrenotazioniByDay(data);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet fogliocalcSheet = workbook.createSheet("Prenotazioni Giornaliere");

            // Creazione Stile per l'header
            XSSFCellStyle headerStyle = workbook.createCellStyle();
            XSSFFont headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Creazione Header
            Row headerRow = fogliocalcSheet.createRow(0);
            String[] colonne = { "Data", "Ora Inizio", "Ora Fine", "Utente", "Stanza", "Postazione", "Stato" };

            for (int i = 0; i < colonne.length; i++) {
                Cell cella = headerRow.createCell(i);
                cella.setCellValue(colonne[i]);
                cella.setCellStyle(headerStyle);
                fogliocalcSheet.autoSizeColumn(i);
            }

            if (!prenotazioni.isEmpty()) {
                // Formato Data/Ora
                DateTimeFormatter dataFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                DateTimeFormatter oraFormatter = DateTimeFormatter.ofPattern(" HH:mm");

                int numeroRiga = 1;

                for (PrenotazioniDTO prenotazione : prenotazioni) {
                    Row row = fogliocalcSheet.createRow(numeroRiga++);

                    // Gestione data e ora separatamente
                    if (prenotazione.getData_inizio() != null) {
                        // Colonna Data
                        row.createCell(0).setCellValue(
                                prenotazione.getData_inizio().format(dataFormatter));
                        // Colonna Ora Inizio
                        row.createCell(1).setCellValue(
                                prenotazione.getData_inizio().format(oraFormatter));
                    } else {
                        row.createCell(0).setCellValue("N/D");
                        row.createCell(1).setCellValue("N/D");
                    }

                    // Gestione ora fine
                    if (prenotazione.getData_fine() != null) {
                        row.createCell(2).setCellValue(
                                prenotazione.getData_fine().format(oraFormatter));
                    } else {
                        row.createCell(2).setCellValue("N/D");
                    }

                    // Debug log
                    System.out.println("Prenotazione processata:");

                    // Altri campi con controlli null "Stanza", "Postazione", "Stato"
                    row.createCell(3).setCellValue(
                            prenotazione.getUsers() != null ? prenotazione.getUsers().getEmail() : "N/D");
                    row.createCell(4).setCellValue(
                            prenotazione.getStanze() != null ? prenotazione.getStanze().getNome() : "N/D");
                    row.createCell(5).setCellValue(
                            prenotazione.getPostazione() != null ? prenotazione.getPostazione().getNomePostazione()
                                    : "N/D");
                    row.createCell(6).setCellValue(
                            prenotazione.getStato_prenotazione() != null
                                    ? prenotazione.getStato_prenotazione().toString()
                                    : "N/D");
                }
            } else {
                System.out.println("Nessuna Prenotazione Trovata - Creato file sono con l'header");
            }

            // Auto Dimensionamento colonne
            for (int i = 0; i < colonne.length; i++) {
                fogliocalcSheet.autoSizeColumn(i);
            }

            // Conversione WorkBook in byte array
            try {
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                workbook.write(outputStream);
                return outputStream.toByteArray();
            } catch (Exception e) {
                throw new RuntimeException("Errore nella generazione del file Excel", e);
            }

        } catch (Exception e) {
            throw new RuntimeException("Errore Durante La generazione del File Excel" + e.getMessage());
        }
    }

}
