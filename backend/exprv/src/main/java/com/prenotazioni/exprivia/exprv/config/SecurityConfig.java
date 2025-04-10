// package com.prenotazioni.exprivia.exprv.config;

// //import com.prenotazioni.exprivia.exprv.config.JwtAuthFilter;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import com.prenotazioni.exprivia.exprv.entity.Users;
// import com.prenotazioni.exprivia.exprv.repository.UserRepository;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Autowired
//     private JwtAuthFilter jwtAuthFilter;

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http.csrf(AbstractHttpConfigurer::disable)
//                 .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/login", "/registrazione").permitAll()
//                 .anyRequest().authenticated()
//                 )
//                 .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//         return config.getAuthenticationManager();
//     }

//     @Bean
//     public UserDetailsService userDetailsService(UserRepository userRepository) {
//         return username -> {
//             Users user = userRepository.findByemail(username)
//                     .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + username));

//             // Mappa l'utente in un oggetto UserDetails
//             return org.springframework.security.core.userdetails.User.builder()
//                     .username(user.getEmail())
//                     .password(user.getPassword())
//                     .authorities(user.getRuolo_utente().name()) // Assicurati che i ruoli siano corretti
//                     .build();
//         };
//     }
// }
