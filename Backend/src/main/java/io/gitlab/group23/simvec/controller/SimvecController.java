package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.model.VectorDatabaseRequest;
import io.gitlab.group23.simvec.service.UserService;
import io.gitlab.group23.simvec.service.VectorDatabaseService;
import io.gitlab.group23.simvec.util.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
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
		return "Hello World!";
	}

	@PostMapping("/register")
	public ResponseEntity<SimvecUser> registerUser(@RequestBody SimvecUser simvecUser) {
		return ResponseEntity.ok(userService.saveUser(simvecUser));
	}

	@PostMapping("/image-based-search/{topk}")
	public ResponseEntity<List<byte[]>> imageBasedSearch(@RequestParam("file") MultipartFile image, @PathVariable(name = "topk") String topk) {
		try {
			return ResponseEntity.ok(vectorDatabaseService.executeImageBasedSearch(image, topk));
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
		} catch (InterruptedException e) {
			return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
		}
	}

	@PostMapping("/text-based-search")
	public ResponseEntity<List<byte[]>> textBasedSearch(@RequestBody VectorDatabaseRequest vectorDatabaseRequest) throws IOException, InterruptedException {
		List<byte[]> images = vectorDatabaseService.executeTextBasedSearch(vectorDatabaseRequest);
		System.out.println(Base64.getEncoder().encodeToString(images.get(0)));
		// System.out.println(Arrays.toString(images.get(0)));
		System.out.println(ResponseEntity.ok(images));
		return ResponseEntity.ok(images);
	}

	@GetMapping("/cloud-synchronization")
	public String cloudSynchronization() {
		// This can be implemented as a cron job
		// TODO: Cloud synchronization logic
		return "Hit cloud synchronization endpoint";
	}

}
