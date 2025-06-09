package com.prenotazioni.exprivia.exprv.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.prenotazioni.exprivia.exprv.entity.CosaDurata;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrenotazioniDTO {
    private Integer id_prenotazioni;
    
    // Per la creazione usiamo gli ID
    private Integer id_user;
    private Integer id_postazione;
    private Integer id_stanza;
    
    // Per le risposte includiamo oggetti semplificati
    private UserInfo users;
    private PostazioneInfo postazione;
    private StanzaInfo stanze;

    private stato_prenotazione stato_prenotazione;
    private LocalDateTime data_inizio;
    private LocalDateTime data_fine;

    private Set<CosaDurata> coseDurata = new HashSet<>();

    // Inner classes per JSON serialization
    public static class UserInfo {
        private Integer id_user;
        private String nome;
        private String cognome;
        private String email;
        private Boolean enabled;
        
        public UserInfo() {}
        
        public UserInfo(Users user) {
            if (user != null) {
                this.id_user = user.getId_user();
                this.nome = user.getNome();
                this.cognome = user.getCognome();
                this.email = user.getEmail();
                this.enabled = user.getEnabled();
            }
        }

        // Getters and setters
        public Integer getId_user() { return id_user; }
        public void setId_user(Integer id_user) { this.id_user = id_user; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getCognome() { return cognome; }
        public void setCognome(String cognome) { this.cognome = cognome; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Boolean getEnabled() { return enabled; }
        public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    }

    public static class PostazioneInfo {
        private Integer id_postazione;
        private String nomePostazione;
        
        public PostazioneInfo() {}
        
        public PostazioneInfo(Postazioni postazione) {
            if (postazione != null) {
                this.id_postazione = postazione.getId_postazione();
                this.nomePostazione = postazione.getNomePostazione();
            }
        }

        // Getters and setters
        public Integer getId_postazione() { return id_postazione; }
        public void setId_postazione(Integer id_postazione) { this.id_postazione = id_postazione; }
        public String getNomePostazione() { return nomePostazione; }
        public void setNomePostazione(String nomePostazione) { this.nomePostazione = nomePostazione; }
    }

    public static class StanzaInfo {
        private Integer id_stanza;
        private String nome;
        private String tipo_stanza;
        
        public StanzaInfo() {}
        
        public StanzaInfo(Stanze stanza) {
            if (stanza != null) {
                this.id_stanza = stanza.getId_stanza();
                this.nome = stanza.getNome();
                this.tipo_stanza = stanza.getTipo_stanza() != null ? stanza.getTipo_stanza().toString() : null;
            }
        }

        // Getters and setters
        public Integer getId_stanza() { return id_stanza; }
        public void setId_stanza(Integer id_stanza) { this.id_stanza = id_stanza; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getTipo_stanza() { return tipo_stanza; }
        public void setTipo_stanza(String tipo_stanza) { this.tipo_stanza = tipo_stanza; }
    }

    public PrenotazioniDTO() {
    }

    // Costruttore per la creazione
    public PrenotazioniDTO(Integer id_user, Integer id_postazione, Integer id_stanza,
            LocalDateTime data_inizio, LocalDateTime data_fine) {
        this.id_user = id_user;
        this.id_postazione = id_postazione;
        this.id_stanza = id_stanza;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
    }

    // Costruttore completo per le risposte
    public PrenotazioniDTO(Integer id_prenotazioni, Users users, Postazioni postazione, Stanze stanze,
            stato_prenotazione stato_prenotazione, LocalDateTime data_inizio, LocalDateTime data_fine) {
        this.id_prenotazioni = id_prenotazioni;
        this.users = new UserInfo(users);
        this.postazione = new PostazioneInfo(postazione);
        this.stanze = new StanzaInfo(stanze);
        this.stato_prenotazione = stato_prenotazione;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
    }

    // Getters e Setters
    public Integer getId_prenotazioni() {
        return id_prenotazioni;
    }

    public void setId_prenotazioni(Integer id_prenotazioni) {
        this.id_prenotazioni = id_prenotazioni;
    }

    public Integer getId_user() {
        return id_user;
    }

    public void setId_user(Integer id_user) {
        this.id_user = id_user;
    }

    public Integer getId_postazione() {
        return id_postazione;
    }

    public void setId_postazione(Integer id_postazione) {
        this.id_postazione = id_postazione;
    }

    public Integer getId_stanza() {
        return id_stanza;
    }

    public void setId_stanza(Integer id_stanza) {
        this.id_stanza = id_stanza;
    }

    public UserInfo getUsers() {
        return users;
    }

    public void setUsers(UserInfo users) {
        this.users = users;
    }

    public PostazioneInfo getPostazione() {
        return postazione;
    }

    public void setPostazione(PostazioneInfo postazione) {
        this.postazione = postazione;
    }

    public StanzaInfo getStanze() {
        return stanze;
    }

    public void setStanze(StanzaInfo stanze) {
        this.stanze = stanze;
    }

    public stato_prenotazione getStato_prenotazione() {
        return stato_prenotazione;
    }

    public void setStato_prenotazione(stato_prenotazione stato_prenotazione) {
        this.stato_prenotazione = stato_prenotazione;
    }

    public LocalDateTime getData_inizio() {
        return data_inizio;
    }

    public void setData_inizio(LocalDateTime data_inizio) {
        this.data_inizio = data_inizio;
    }

    public LocalDateTime getData_fine() {
        return data_fine;
    }

    public void setData_fine(LocalDateTime data_fine) {
        this.data_fine = data_fine;
    }

    public Set<CosaDurata> getCoseDurata() {
        return coseDurata;
    }

    public void setCoseDurata(Set<CosaDurata> coseDurata) {
        this.coseDurata = coseDurata;
    }
}
