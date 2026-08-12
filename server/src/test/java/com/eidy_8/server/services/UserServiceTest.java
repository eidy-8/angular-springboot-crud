package com.eidy_8.server.services;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.eidy_8.server.dtos.CreateUserRequest;
import com.eidy_8.server.dtos.UserResponse;
import com.eidy_8.server.entities.User;
import com.eidy_8.server.exceptions.EmailAlreadyExistsException;
import com.eidy_8.server.exceptions.UserNotFoundException;
import com.eidy_8.server.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

	@Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUser() {

        CreateUserRequest request = new CreateUserRequest();

        request.setEmail("maria@email.com");
        request.setPassword("123456");
        request.setName("Maria");

        when(repository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("hashed-password");

        User savedUser = new User();

        savedUser.setId(UUID.randomUUID());
        savedUser.setEmail(request.getEmail());
        savedUser.setPassword("hashed-password");
        savedUser.setName(request.getName());

        when(repository.save(any(User.class)))
                .thenReturn(savedUser);

        UserResponse response = userService.create(request);

        assertEquals("maria@email.com", response.getEmail());
        assertEquals("Maria", response.getName());

        verify(repository).save(any(User.class));
    }
    
    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        CreateUserRequest request = new CreateUserRequest();

        request.setEmail("maria@email.com");
        request.setPassword("123456");
        request.setName("Maria");

        when(repository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        assertThrows(
            EmailAlreadyExistsException.class,
            () -> userService.create(request)
        );

        verify(repository, never()).save(any(User.class));
    }
    
    @Test
    void shouldFindUserById() {

        UUID id = UUID.randomUUID();

        User user = new User();

        user.setId(id);
        user.setEmail("maria@email.com");
        user.setName("Maria");

        when(repository.findByIdAndDeletedAtIsNull(id))
                .thenReturn(Optional.of(user));

        UserResponse response = userService.findById(id);

        assertEquals(id, response.getId());
        assertEquals("maria@email.com", response.getEmail());
        assertEquals("Maria", response.getName());
    }
    
    @Test
    void shouldThrowExceptionWhenUserDoesNotExist() {

        UUID id = UUID.randomUUID();

        when(repository.findByIdAndDeletedAtIsNull(id))
                .thenReturn(Optional.empty());

        assertThrows(
            UserNotFoundException.class,
            () -> userService.findById(id)
        );
    }
    
    @Test
    void shouldSoftDeleteUser() {

        UUID id = UUID.randomUUID();

        User user = new User();

        user.setId(id);
        user.setEmail("maria@email.com");
        user.setName("Maria");

        when(repository.findByIdAndDeletedAtIsNull(id))
                .thenReturn(Optional.of(user));

        userService.deleteById(id);

        assertNotNull(user.getDeletedAt());

        verify(repository).save(user);
    }
}
