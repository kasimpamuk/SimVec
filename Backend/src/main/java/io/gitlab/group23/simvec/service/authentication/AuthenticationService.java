package io.gitlab.group23.simvec.service.authentication;

import io.gitlab.group23.simvec.model.SimvecUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

	private final RegisterService registerService;

	@Autowired
	public AuthenticationService(RegisterService registerService) {
		this.registerService = registerService;
	}

//	public SimvecUser registerUser(SimvecUser simvecUser) {
//		return registerService.registerUser(simvecUser);
//	}

//	public String verifyUserEmail(String token) {
//		return registerService.verifyUserEmail(token);
//	}


}
