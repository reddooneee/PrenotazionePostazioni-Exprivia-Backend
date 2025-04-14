package com.prenotazioni.exprivia.exprv.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    @Value("${app.jwt-secret:jwtSecretKeyDeveSuperareLunghezzaMinimaPerHS512AlmenoTrentadueBytesLungo}")
    private String jwtSecret;
    
    @Value("${app.jwt-expiration-milliseconds:86400000}")
    private long jwtExpirationInMs;
    
    // Genera token JWT dall'autenticazione
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return generateToken(username);
    }

    // Genera token JWT dal nome utente
    public String generateToken(String username) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationInMs);
        
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
    
    // Estrae lo username dal token JWT
    public String getUsernameFromToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getSubject();
    }

    public String refreshToken(String token) {
        if (!validateToken(token)) {
            throw new IllegalArgumentException("Invalid JWT token");
        }
    
        String username = getUsernameFromToken(token);
        return generateToken(username);  // genera un nuovo token con lo stesso nome utente
    }
    
    
    // Valida il token JWT
    public boolean validateToken(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            
            return true;
        } catch (SignatureException e) {
            // Firma non valida
            return false;
        } catch (Exception e) {
            // Token scaduto o altri errori
            return false;
        }
    }
}