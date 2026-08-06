package com.eidy_8.server.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eidy_8.server.entities.User;

public interface UserRepository extends JpaRepository<User, UUID> {

}
