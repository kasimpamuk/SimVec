package io.gitlab.group23.simvec.service.authentication;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

	private final UserService userService;

	@Autowired
	public RegisterService(UserService userService) {
		this.userService = userService;
	}

	public SimvecUser registerUser(SimvecUser simvecUser) {
		return userService.saveUser(simvecUser);
	}

}
