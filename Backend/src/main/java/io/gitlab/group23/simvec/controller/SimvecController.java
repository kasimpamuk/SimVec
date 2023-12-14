package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SimvecController {

	private final UserService userService;

	@Autowired
	public SimvecController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<SimvecUser> registerUser(@RequestBody SimvecUser simvecUser) {
		return ResponseEntity.ok(userService.saveUser(simvecUser));
	}

	@GetMapping("/text-based-search")
	public String textBasedSearch() {
		// TODO: Text based search logic
		return "Hit text based search endpoint";
	}

	@GetMapping("/image-based-search")
	public String imageBasedSearch() {
		// TODO: Image based search logic
		return "Hit image based search endpoint";
	}

	@GetMapping("/cloud-synchronization")
	public String cloudSynchronization() {
		// This can be implemented as a cron job
		// TODO: Cloud synchronization logic
		return "Hit cloud synchronization endpoint";
	}

}
