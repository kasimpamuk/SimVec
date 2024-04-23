package io.gitlab.group23.simvec.service.authentication;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static io.gitlab.group23.simvec.util.Constants.*;

@Service
public class RegisterService {

	private final UserService userService;
	private final EmailService emailService;

	@Autowired
	public RegisterService(UserService userService, EmailService emailService) {
		this.userService = userService;
		this.emailService = emailService;
	}

//	public SimvecUser registerUser(SimvecUser simvecUser) {
//		simvecUser.setEmailVerificationToken(generateEmailVerificationToken());
//		SimvecUser savedUser = userService.saveUser(simvecUser);
//		emailService.sendVerificationEmail(simvecUser, HOST_URL + API);
//		return savedUser;
//	}

//	public String verifyUserEmail(String token) {
//		return emailService.verifyUserEmail(token);
//	}

	private static String generateEmailVerificationToken() {
		return UUID.randomUUID().toString();
	}

}
