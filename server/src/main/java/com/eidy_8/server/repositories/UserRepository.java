package com.eidy_8.server.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.eidy_8.server.entities.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	
	Page<User> findByDeletedAtIsNull(Pageable pageable);
	
	Optional<User> findByIdAndDeletedAtIsNull(UUID id);

	boolean existsByEmail(String email);
}
