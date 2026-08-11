package com.eidy_8.server.exceptions;

public class UserNotFoundException extends RuntimeException {

	public UserNotFoundException() {
        super("Usuário não encontrado.");
    }
}
