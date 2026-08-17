package com.eidy_8.server.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.eidy_8.server.entities.User;
import com.eidy_8.server.repositories.UserRepository;

@Service 
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository repository;
	
	public CustomUserDetailsService(UserRepository repository) {
		this.repository = repository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		
		User user = repository.findByEmailAndDeletedAtIsNull(email).orElseThrow(() -> 
			new UsernameNotFoundException("Usuário não encontrado.")
		);
		
		return new CustomUserDetails(user);
	}
}
