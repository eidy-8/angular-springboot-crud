package com.eidy_8.server.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {

	public EmailAlreadyExistsException() {
        super("Email já cadastrado.");
    }
}
