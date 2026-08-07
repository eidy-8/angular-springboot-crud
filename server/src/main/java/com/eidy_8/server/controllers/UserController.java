package com.eidy_8.server.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eidy_8.server.dtos.CreateUserRequest;
import com.eidy_8.server.dtos.UserResponse;
import com.eidy_8.server.entities.User;
import com.eidy_8.server.repositories.UserRepository;
import com.eidy_8.server.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

	private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }
    
    @PostMapping
    public UserResponse create(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }
}
