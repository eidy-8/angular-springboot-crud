package com.eidy_8.server.services;

import java.time.Instant;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.eidy_8.server.dtos.LoginRequest;

@Service
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtEncoder jwtEncoder;
	
	public AuthService(AuthenticationManager authenticationManager, JwtEncoder jwtEncoder) {
		this.authenticationManager = authenticationManager;
		this.jwtEncoder = jwtEncoder;
	}
	
	public String login(LoginRequest request) {
		
		Authentication authentication = 
				authenticationManager.authenticate(
						new UsernamePasswordAuthenticationToken(
								request.getEmail(),
								request.getPassword()
						)
				);
		
		Instant now = Instant.now();
		
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.subject(authentication.getName())
				.issuedAt(now)
				.expiresAt(now.plusSeconds(3600))
				.build();
		
		String token = jwtEncoder
				.encode(JwtEncoderParameters.from(claims))
				.getTokenValue();
		
		return token;
	}
}
