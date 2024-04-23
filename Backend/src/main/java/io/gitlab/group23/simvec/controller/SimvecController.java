package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.VectorDatabaseRequest;
import io.gitlab.group23.simvec.service.*;
import io.gitlab.group23.simvec.service.vectordb.ImagePopulationService;
import io.gitlab.group23.simvec.service.vectordb.VectorDatabaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@Slf4j
public class SimvecController {

	private final VectorDatabaseService vectorDatabaseService;
	private final ImagePopulationService imagePopulationService;
	private final TranslateText translateText;

	@Autowired
	public SimvecController(VectorDatabaseService vectorDatabaseService, ImagePopulationService imagePopulationService, TranslateText translateText) {
		this.vectorDatabaseService = vectorDatabaseService;
		this.imagePopulationService = imagePopulationService;
		this.translateText = translateText;
	}


	@GetMapping("/test-endpoint")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<String> testEndpoint() {
		return ResponseEntity.ok("Welcome to Test Endpoint!");
	}


	@PostMapping("/image-based-search/{topk}")
	@PreAuthorize("hasAuthority('ROLE_USER')")
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
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<List<byte[]>> textBasedSearch(@RequestBody VectorDatabaseRequest vectorDatabaseRequest) throws IOException, InterruptedException {
		System.out.println("Text Based Search Endpoint");
		 String translatedText = translateText.translateText("hidden-marker-416811" , "en", vectorDatabaseRequest.getInput());
		 vectorDatabaseRequest.setInput(translatedText);
		List<byte[]> images = vectorDatabaseService.executeTextBasedSearch(vectorDatabaseRequest);
		return ResponseEntity.ok(images);
	}


	@PostMapping("/transfer-images")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<?> transferImages(@RequestParam("images") MultipartFile[] images) {
		imagePopulationService.saveImages(images, "alper");
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Images are saved successfully");
	}


}
