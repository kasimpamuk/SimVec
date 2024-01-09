package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.config.authentication.JwtUtil;
import io.gitlab.group23.simvec.model.SimvecUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authentication")
@CrossOrigin
public class AuthenticationController {

	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;

	@Autowired
	public AuthenticationController(JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
		this.jwtUtil = jwtUtil;
		this.authenticationManager = authenticationManager;
	}

	@GetMapping("/accessible-without-authentication")
	public ResponseEntity<String> accessibleWithoutAuthentication() {
		return ResponseEntity.ok("accessible-without-authentication");
	}

	@GetMapping("/auth")
	public ResponseEntity<String> auth() {
		String email = "example-email";
		String password = "example_password";
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
		String name = authentication.getName();
		return ResponseEntity.ok(jwtUtil.createToken(new SimvecUser(19, "alper", "keskin", "my_pass")));
	}

}
