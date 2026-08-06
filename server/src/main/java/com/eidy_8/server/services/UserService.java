package com.eidy_8.server.services;

import org.springframework.stereotype.Service;

import com.eidy_8.server.repositories.UserRepository;

@Service
public class UserService {

	private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
