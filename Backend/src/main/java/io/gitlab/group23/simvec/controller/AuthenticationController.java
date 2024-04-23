package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.AuthRequest;
import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.JwtService;
import io.gitlab.group23.simvec.service.UserInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthenticationController {

	private final UserInfoService userInfoService;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	@Autowired
	public AuthenticationController(UserInfoService userInfoService, AuthenticationManager authenticationManager, JwtService jwtService) {
		this.userInfoService = userInfoService;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}

	@PostMapping("/register")
	public String register(@RequestBody SimvecUser userInfo) {
		log.info("Register: " + userInfo.toString());
		return userInfoService.addUser(userInfo);
	}

	@PostMapping("/login")
	public String login(@RequestBody AuthRequest authRequest) {
		log.info(String.format("Login: %s", authRequest.toString()));
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
		if (authentication.isAuthenticated()) {
			return jwtService.generateToken(authRequest.getUsername());
		} else {
			throw new UsernameNotFoundException("invalid user request !");
		}
	}

}
