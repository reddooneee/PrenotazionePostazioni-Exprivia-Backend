package com.prenotazioni.exprivia.exprv.config;

import java.util.Arrays;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
public class WebConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        // Crea una nuova sorgente di configurazione CORS basata su URL
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Crea una nuova configurazione CORS
        CorsConfiguration config = new CorsConfiguration();

        // Permette l'invio delle credenziali (cookie, autenticazione HTTP)
        config.setAllowCredentials(true);

        // Permette le richieste solo dall'origine specificata
        config.addAllowedOrigin("http://localhost:4200");

        // Autorizza gli header specificati nelle richieste
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT
        ));

        // Permette i metodi HTTP specificati
        config.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name()
        ));

        // Imposta la durata massima della cache delle risposte preflight
        config.setMaxAge(3600L);

        // Registra la configurazione CORS per tutte le rotte
        source.registerCorsConfiguration("/**", config);

        // Crea un bean di registrazione del filtro CORS con la configurazione specificata
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));

        // Imposta l'ordine del filtro (valore negativo per eseguirlo presto nella catena di filtri)
        bean.setOrder(-102);

        // Restituisce il bean di registrazione del filtro
        return bean;
    }
}
