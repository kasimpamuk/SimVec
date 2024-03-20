package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.model.VectorDatabaseRequest;
import io.gitlab.group23.simvec.service.ImagePopulationService;
import io.gitlab.group23.simvec.service.TranslateText;
import io.gitlab.group23.simvec.service.UserService;
import io.gitlab.group23.simvec.service.VectorDatabaseService;
import io.gitlab.group23.simvec.service.authentication.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
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
@Slf4j
public class SimvecController {

	private final VectorDatabaseService vectorDatabaseService;
	private final TranslateText translateText;
	private final AuthenticationService authenticationService;
	private final UserService userService;
	private final ImagePopulationService imagePopulationService;

	@Autowired
	public SimvecController(VectorDatabaseService vectorDatabaseService, TranslateText translateText, AuthenticationService authenticationService, UserService userService, ImagePopulationService imagePopulationService) {
		this.vectorDatabaseService = vectorDatabaseService;
        this.translateText = translateText;
		this.authenticationService = authenticationService;
		this.userService = userService;
		this.imagePopulationService = imagePopulationService;
	}

	@PostMapping("/register")
	public ResponseEntity<SimvecUser> registerUser(@Validated @RequestBody SimvecUser simvecUser) {
		return ResponseEntity.ok(authenticationService.registerUser(simvecUser));
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
		String translatedText = translateText.translateText("hidden-marker-416811" , "en", vectorDatabaseRequest.getInput());
		vectorDatabaseRequest.setInput(translatedText);
		List<byte[]> images = vectorDatabaseService.executeTextBasedSearch(vectorDatabaseRequest);
		return ResponseEntity.ok(images);
	}

	@GetMapping("/verify")
	public String verifyUser(@RequestParam("code") String token) {
		return authenticationService.verifyUserEmail(token);
	}

	@PostMapping("/transfer-images")
	public ResponseEntity<?> transferImages(@RequestParam("images") MultipartFile[] images, @RequestParam String username) {
//		SimvecUser user = userService.getUserByUsername(username);
		imagePopulationService.saveImages(images, "alper");
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Images are saved successfully");
	}


}
