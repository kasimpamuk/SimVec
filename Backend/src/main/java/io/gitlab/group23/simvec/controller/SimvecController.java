package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import io.gitlab.group23.simvec.service.VectorDatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class SimvecController {

	private final UserService userService;
	private final VectorDatabaseService vectorDatabaseService;

	@Autowired
	public SimvecController(UserService userService, VectorDatabaseService vectorDatabaseService) {
		this.userService = userService;
		this.vectorDatabaseService = vectorDatabaseService;
	}

	@GetMapping("/test")
	public String test() {
		return "test hit!";
	}

	@PostMapping("/register")
	public ResponseEntity<SimvecUser> registerUser(@RequestBody SimvecUser simvecUser) {
		return ResponseEntity.ok(userService.saveUser(simvecUser));
	}

	@PostMapping("/image-based-search")
	public ResponseEntity<List<byte[]>> imageBasedSearch(@RequestParam("file") MultipartFile image) {
		try {
			return ResponseEntity.ok(vectorDatabaseService.executeImageBasedSearch(image));
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
		} catch (InterruptedException e) {
			return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
		}
	}

	@PostMapping("/text-based-search")
	public ResponseEntity<List<byte[]>> textBasedSearch(@RequestBody String text) throws IOException, InterruptedException {
		return ResponseEntity.ok(vectorDatabaseService.executeTextBasedSearch(text));
	}

	@GetMapping("/cloud-synchronization")
	public String cloudSynchronization() {
		// This can be implemented as a cron job
		// TODO: Cloud synchronization logic
		return "Hit cloud synchronization endpoint";
	}

}
