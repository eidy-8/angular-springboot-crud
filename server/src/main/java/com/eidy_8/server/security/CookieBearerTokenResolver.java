package com.eidy_8.server.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;

public class CookieBearerTokenResolver implements BearerTokenResolver {

	private static final String COOKIE_NAME = "AUTH_TOKEN";
	private final DefaultBearerTokenResolver headerResolver = new DefaultBearerTokenResolver();

	@Override
	public String resolve(HttpServletRequest request) {
		String headerToken = headerResolver.resolve(request);
		if (headerToken != null) {
			return headerToken;
		}

		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if (COOKIE_NAME.equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}

		return null;
	}
}