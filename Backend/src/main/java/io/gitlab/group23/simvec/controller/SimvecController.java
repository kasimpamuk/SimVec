package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import io.gitlab.group23.simvec.service.VectorDatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

	@PostMapping("/text-based-search")
	public ResponseEntity<List<String>> textBasedSearch(@RequestBody String text) throws IOException, InterruptedException {
		return ResponseEntity.ok(vectorDatabaseService.executeTextBasedSearch(text));
	}

	@PostMapping("/image-based-search")
	public ResponseEntity<byte[]> imageBasedSearch(@RequestParam("file") MultipartFile file) {
		try {
			// Directly return the uploaded file as bytes
			byte[] fileData = file.getBytes();
			//atakana call
			//atakanın pathler bytestream
			//return
			return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(fileData);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@GetMapping("/cloud-synchronization")
	public String cloudSynchronization() {
		// This can be implemented as a cron job
		// TODO: Cloud synchronization logic
		return "Hit cloud synchronization endpoint";
	}

}
