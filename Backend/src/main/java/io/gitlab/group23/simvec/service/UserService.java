package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public List<SimvecUser> getAllUsers() {
		return userRepository.findAll();
	}

	public Optional<SimvecUser> getUserById(Integer id) {
		return userRepository.findById(id);
	}

	public SimvecUser saveUser(SimvecUser simvecUser) {
		if (userRepository.existsByEmailOrUserName(simvecUser.getEmail(), simvecUser.getUserName())) {
			throw new RuntimeException("The user with the same email or username already exists");
		}
		return userRepository.save(simvecUser);
	}

	public SimvecUser getUserByVerificationToken(String verificationToken) {
		return userRepository.findSimvecUserByEmailVerificationToken(verificationToken);
	}

	public void deleteUser(Integer id) {
		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
			return;
		}
		log.warn("UserService::deleteUser(): No user found with the given id");
	}

}
