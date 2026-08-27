package com.eidy_8.server.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eidy_8.server.dtos.CreateUserRequest;
import com.eidy_8.server.dtos.UpdateUserRequest;
import com.eidy_8.server.dtos.UserResponse;
import com.eidy_8.server.entities.User;
import com.eidy_8.server.exceptions.EmailAlreadyExistsException;
import com.eidy_8.server.exceptions.UserNotFoundException;
import com.eidy_8.server.repositories.UserRepository;

@Service
public class UserService {

	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
    	
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public Page<UserResponse> findAll(int page, int pageSize) {
    	
        return repository.findByDeletedAtIsNull(PageRequest.of(page, pageSize))
                .map(this::toResponse);
    }
    
    public UserResponse findById(UUID id) {
    	
    	User user = repository.findByIdAndDeletedAtIsNull(id).orElseThrow(UserNotFoundException::new);
    	
    	return toResponse(user);
    }
    
    public UserResponse findByEmail(String email) {

        User user = repository
                .findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(UserNotFoundException::new);

        return toResponse(user);
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
    
    public UserResponse updateById(UUID id, UpdateUserRequest request) {
    	
    	User user = repository.findByIdAndDeletedAtIsNull(id).orElseThrow(UserNotFoundException::new);
    	
    	if (!user.getEmail().equals(request.getEmail()) && repository.existsByEmail(request.getEmail())) {
    		throw new EmailAlreadyExistsException();
    	}
    	
    	user.setEmail(request.getEmail());
    	user.setName(request.getName());
    	
        repository.saveAndFlush(user);

        User updatedUser = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(UserNotFoundException::new);

        return toResponse(updatedUser);
    }
    
    public void deleteById(UUID id) {
    	
    	User user = repository.findByIdAndDeletedAtIsNull(id).orElseThrow(UserNotFoundException::new);
    	
    	user.setDeletedAt(LocalDateTime.now());
    	
    	repository.save(user);
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
