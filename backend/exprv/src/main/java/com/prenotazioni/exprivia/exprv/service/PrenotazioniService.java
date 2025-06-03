package com.prenotazioni.exprivia.exprv.service;

import java.io.ByteArrayOutputStream;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

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
import com.prenotazioni.exprivia.exprv.dto.SelectOptionDTO;
import com.prenotazioni.exprivia.exprv.dto.CreatePrenotazioneDTO;
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

        if (updates.containsKey("id_prenotazioni")) {
            Integer newId = (Integer) updates.get("id_prenotazioni");
            Optional<Prenotazioni> prenotazioneWithSameId = prenotazioniRepository.findById(newId);
            if (prenotazioneWithSameId.isPresent() && !prenotazioneWithSameId.get().getId_prenotazioni().equals(id)) {
                throw new IllegalArgumentException("ID prenotazione già in uso");
            }
        }

        updates.forEach((key, value) -> {
            switch (key) {
                case "stato_prenotazione":
                    existingPrenotazioni.setStato_prenotazione(stato_prenotazione.valueOf(value.toString()));
                    break;
                case "data_inizio":
                    existingPrenotazioni.setDataInizio(LocalDateTime.parse(value.toString()));
                    break;
                case "data_fine":
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

        // Verifica che la prenotazione non sia nel passato
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Non è possibile effettuare prenotazioni nel passato!");
        }

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

    /**
     * Crea una nuova prenotazione per l'utente loggato
     * 
     * @param request   i dati della prenotazione
     * @param userEmail email dell'utente loggato
     * @return PrenotazioniDTO della prenotazione creata
     */
    @Transactional
    public PrenotazioniDTO creaPrenotazione(CreatePrenotazioneDTO request, String userEmail) {
        System.out.println("DEBUG - Inizio creazione prenotazione");
        System.out.println("DEBUG - Dati ricevuti: " + request);
        System.out.println("DEBUG - Email utente: " + userEmail);

        // Recupera l'utente dal database
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));
        System.out.println("DEBUG - Utente trovato: " + user.getEmail());

        // Recupera la postazione
        Postazioni postazione = postazioniRepository.findById(request.getId_postazione())
                .orElseThrow(() -> new EntityNotFoundException("Postazione non trovata"));
        System.out.println("DEBUG - Postazione trovata: " + postazione.getNomePostazione());

        // Recupera la stanza
        Stanze stanza = stanzeRepository.findById(request.getId_stanza())
                .orElseThrow(() -> new EntityNotFoundException("Stanza non trovata"));
        System.out.println("DEBUG - Stanza trovata: " + stanza.getNome());

        System.out.println("DEBUG - Date ricevute - Inizio: " + request.getData_inizio() + ", Fine: " + request.getData_fine());
        // Validazione delle date
        validateDates(request.getData_inizio(), request.getData_fine());
        System.out.println("DEBUG - Date validate con successo");

        // Verifica sovrapposizioni
        checkOverlappingBookings(request.getData_inizio(), request.getData_fine(),
                request.getId_postazione());
        System.out.println("DEBUG - Nessuna sovrapposizione trovata");

        // Crea la prenotazione
        Prenotazioni prenotazione = new Prenotazioni();
        prenotazione.setUsers(user);
        prenotazione.setPostazione(postazione);
        prenotazione.setStanze(stanza);
        prenotazione.setDataInizio(request.getData_inizio());
        prenotazione.setDataFine(request.getData_fine());
        prenotazione.setStato_prenotazione(stato_prenotazione.Confermata);
        System.out.println("DEBUG - Oggetto prenotazione creato: " + prenotazione);

        // Salva la prenotazione
        Prenotazioni savedPrenotazione = prenotazioniRepository.save(prenotazione);
        System.out.println("DEBUG - Prenotazione salvata con ID: " + savedPrenotazione.getId_prenotazioni());

        // Converti e restituisci il DTO
        PrenotazioniDTO dto = prenotazioniMapper.toDto(savedPrenotazione);
        System.out.println("DEBUG - DTO creato e pronto per essere restituito");
        return dto;
    }

    /**
     * Valida le date di inizio e fine della prenotazione
     */
    private void validateDates(LocalDateTime startTime, LocalDateTime endTime) {
        validateStartTime(startTime);

        if (endTime == null) {
            throw new IllegalArgumentException("La data di fine non può essere nulla!");
        }

        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("La data di fine deve essere successiva alla data di inizio!");
        }

        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Non è possibile effettuare prenotazioni nel passato!");
        }
    }

    /**
     * Verifica se ci sono sovrapposizioni con altre prenotazioni
     */
    private void checkOverlappingBookings(LocalDateTime startTime, LocalDateTime endTime, Integer postazioneId) {
        List<Prenotazioni> overlappingBookings = prenotazioniRepository.findOverlappingBookings(startTime, endTime,
                postazioneId);
        if (!overlappingBookings.isEmpty()) {
            throw new IllegalArgumentException("La postazione è già prenotata in questo periodo!");
        }
    }

    /**
     * Recupera tutte le stanze come opzioni per una select
     */
    public List<SelectOptionDTO> getStanzeOptions() {
        return stanzeRepository.findAll().stream()
            .map(stanza -> new SelectOptionDTO(stanza.getId_stanza(), stanza.getNome()))
            .toList();
    }

    /**
     * Recupera tutte le postazioni di una stanza come opzioni per una select
     */
    public List<SelectOptionDTO> getPostazioniByStanzaOptions(Integer idStanza) {
        return postazioniRepository.findByStanzaId(idStanza).stream()
            .map(postazione -> new SelectOptionDTO(postazione.getId_postazione(), postazione.getNomePostazione()))
            .toList();
    }

    /**
     * Recupera le fasce orarie disponibili per una postazione in una data specifica
     * @return Lista di orari disponibili nel formato HH:mm
     */
    public List<String> getOrariDisponibili(Integer idPostazione, LocalDate data) {
        List<String> tuttiOrari = List.of("08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00");
        
        // Recupera le prenotazioni esistenti per quella postazione in quella data
        LocalDateTime inizioGiornata = data.atStartOfDay();
        LocalDateTime fineGiornata = data.atTime(23, 59, 59);
        
        List<Prenotazioni> prenotazioniEsistenti = prenotazioniRepository.findOverlappingBookings(
            inizioGiornata, fineGiornata, idPostazione);

        // Filtra gli orari già prenotati
        return tuttiOrari.stream()
            .filter(orario -> !isOrarioPrenotato(orario, prenotazioniEsistenti, data))
            .toList();
    }

    private boolean isOrarioPrenotato(String orario, List<Prenotazioni> prenotazioni, LocalDate data) {
        LocalDateTime dataOrario = data.atTime(
            Integer.parseInt(orario.split(":")[0]), 
            Integer.parseInt(orario.split(":")[1])
        );

        return prenotazioni.stream().anyMatch(p -> 
            (dataOrario.isEqual(p.getDataInizio()) || dataOrario.isAfter(p.getDataInizio())) &&
            dataOrario.isBefore(p.getDataFine())
        );
    }

    /**
     * Recupera tutte le stanze con le relative postazioni
     */
    public Map<String, List<Map<String, Object>>> getStanzeEPostazioni() {
        List<Stanze> stanze = stanzeRepository.findAll();
        
        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        List<Map<String, Object>> stanzeList = new ArrayList<>();
        
        for (Stanze stanza : stanze) {
            Map<String, Object> stanzaMap = new HashMap<>();
            stanzaMap.put("id", stanza.getId_stanza());
            stanzaMap.put("nome", stanza.getNome());
            
            List<Map<String, Object>> postazioniList = postazioniRepository.findByStanzaId(stanza.getId_stanza())
                .stream()
                .map(p -> {
                    Map<String, Object> postazione = new HashMap<>();
                    postazione.put("id", p.getId_postazione());
                    postazione.put("nome", p.getNomePostazione());
                    return postazione;
                })
                .collect(Collectors.toList());
            
            stanzaMap.put("postazioni", postazioniList);
            stanzeList.add(stanzaMap);
        }
        
        result.put("stanze", stanzeList);
        return result;
    }

}
