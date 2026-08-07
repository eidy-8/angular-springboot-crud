package com.eidy_8.server.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eidy_8.server.dtos.CreateUserRequest;
import com.eidy_8.server.dtos.UserResponse;
import com.eidy_8.server.entities.User;
import com.eidy_8.server.exceptions.EmailAlreadyExistsException;
import com.eidy_8.server.repositories.UserRepository;

@Service
public class UserService {

	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<UserResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    public UserResponse create(CreateUserRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        User savedUser = repository.save(user);

        return toResponse(savedUser);
    }
    
    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}
