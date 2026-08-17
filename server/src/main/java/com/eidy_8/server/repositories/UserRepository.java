package com.eidy_8.server.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.eidy_8.server.entities.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	
	boolean existsByEmail(String email);
	
	Optional<User> findByEmailAndDeletedAtIsNull(String email);
	
	Optional<User> findByIdAndDeletedAtIsNull(UUID id);
	
	Page<User> findByDeletedAtIsNull(Pageable pageable);
}
