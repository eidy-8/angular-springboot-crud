package com.eidy_8.server.controllers;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eidy_8.server.dtos.LoginRequest;
import com.eidy_8.server.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;
	
	public AuthController(AuthService authService) {
		this.authService = authService;
	}
	
	@PostMapping("/login")
	public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest request) {
		ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", authService.login(request))
				.httpOnly(true)
				.secure(false)
				.sameSite("Lax")
				.path("/")
				.maxAge(3600)
				.build();

		return ResponseEntity.ok()
				.header("Set-Cookie", cookie.toString())
				.build();
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout() {
		ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", "")
				.httpOnly(true)
				.secure(false)
				.sameSite("Lax")
				.path("/")
				.maxAge(0)
				.build();

		return ResponseEntity.noContent()
				.header("Set-Cookie", cookie.toString())
				.build();
	}
}
