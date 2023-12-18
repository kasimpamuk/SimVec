package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allows this origin for CORS
public class SimvecController {

	private final UserService userService;


	@Autowired
	public SimvecController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<SimvecUser> registerUser(@Validated @RequestBody SimvecUser simvecUser) {
		SimvecUser savedUser = userService.saveUser(simvecUser);
		return ResponseEntity.ok(savedUser);
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


	@PostMapping("/upload")
	public ResponseEntity<byte[]> uploadAndDisplayImage(@RequestParam("file") MultipartFile file) {
		try {
			// Directly return the uploaded file as bytes
			byte[] fileData = file.getBytes();
			return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(fileData);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

}
