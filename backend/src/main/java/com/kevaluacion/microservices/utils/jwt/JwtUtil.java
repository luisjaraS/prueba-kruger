package com.kevaluacion.microservices.utils.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.kevaluacion.microservices.model.User;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${app.jwt.secret}")
	private String jwtSecret;

	@Value("${app.jwt.expiration}")
	private long jwtExpirationMs;

	public String createToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + jwtExpirationMs);
		return Jwts.builder().setSubject(user.getEmail()).claim("role", user.getRole().name()).setIssuedAt(now)
				.setExpiration(expiry).signWith(getKey(), SignatureAlgorithm.HS256).compact();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
			return true;
		} catch (JwtException e) {
			return false;
		}
	}

	public String getUsernameFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody().getSubject();
	}

	private SecretKey getKey() {
		return Keys.hmacShaKeyFor(jwtSecret.getBytes());
	}
}
