package io.gitlab.group23.simvec.service.authentication;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserService databaseService;

	@Autowired
	public CustomUserDetailsService(UserService databaseService) {
		this.databaseService = databaseService;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		SimvecUser simvecUser = databaseService.getUserByEmail(email);

		List<String> roles = new ArrayList<>();
		roles.add("User");

		UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
				.username(simvecUser.getEmail())
				.password(simvecUser.getPassword())
				.roles(roles.toArray(new String[0]))
				.build();
		return userDetails;
	}
}
