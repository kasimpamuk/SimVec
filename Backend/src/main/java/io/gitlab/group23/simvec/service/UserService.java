package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public SimvecUser saveUser(SimvecUser simvecUser) {
		return userRepository.save(simvecUser);
	}

	public SimvecUser getUserByVerificationToken(String verificationToken) {
		return userRepository.findSimvecUserByEmailVerificationToken(verificationToken);
	}

	public SimvecUser getUserByUsername(String username) {
		Optional<SimvecUser> optionalSimvecUser = userRepository.getSimvecUserByUserName(username);
		if (optionalSimvecUser.isEmpty()) {
			throw new RuntimeException("No user with the given username exists");
		}
		return optionalSimvecUser.get();
	}

}
