package com.prenotazioni.exprivia.exprv.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.prenotazioni.exprivia.exprv.security.jwt.JwtAuthFilter;
import com.prenotazioni.exprivia.exprv.security.jwt.JwtAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint, JwtAuthFilter jwtAuthFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()

                        // Test Endpoints DA VEDERE SE METTERLI ONLY ADMIN O AUTHENTICATED
                        .requestMatchers("/api/prenotazioni/postazioni/9/orari-disponibili").permitAll()

                        // Admin only endpoints
                        .requestMatchers("/api/prenotazioni/export/giorno/**").hasAuthority(AuthoritiesConstants.ADMIN)
                        .requestMatchers("/api/prenotazioni/admin/**").hasAuthority(AuthoritiesConstants.ADMIN)
                        .requestMatchers("/api/admin/**").hasAuthority(AuthoritiesConstants.ADMIN)

                        // Authenticated user endpoints
                        .requestMatchers("/api/utenti/**").authenticated()
                        .requestMatchers("/api/postazioni/**").authenticated()
                        .requestMatchers("/api/stanze/**").authenticated()
                        .requestMatchers("/api/prenotazioni/**").authenticated()
                        .requestMatchers("/api/cose-durata/**").authenticated()
                        .requestMatchers("/api/stats/prenotazioni**").authenticated()
                        .requestMatchers("/api/stats/stanze**").authenticated()

                        // Any other request needs authentication
                        .anyRequest().authenticated());

        // Add JWT filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
