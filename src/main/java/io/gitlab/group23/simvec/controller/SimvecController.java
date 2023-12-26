package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.ImageService;
import io.gitlab.group23.simvec.service.Restrequest;
import io.gitlab.group23.simvec.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api")
public class SimvecController {

	private final UserService userService;

	private final ResourceLoader resourceLoader;
	@Autowired
	private Restrequest restrequest;

	@Autowired
	private ImageService imageService;

	@Autowired
	public SimvecController(UserService userService, ResourceLoader resourceLoader) {
		this.userService = userService;
		this.resourceLoader = resourceLoader;
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

	@PostMapping("/image-based-search")
	public ResponseEntity<String> imageBasedSearch(@RequestParam("image") MultipartFile image) throws Exception {
		if (image.isEmpty()) {
			return ResponseEntity.badRequest().body("Please provide a non-empty image file");
		}

		//TODO: Send request to the python back-end
		String requestUrl = "http://localhost:8081/api/image_conversion";
		HttpResponse<String[]> resp = (HttpResponse<String[]>) restrequest.sendPostRequest();



		String imageFileName = image.getOriginalFilename();
		System.out.println("Received image file: " + imageFileName);
		return ResponseEntity.ok("File uploaded successfully: " + imageFileName);
	}

	@GetMapping("/cloud-synchronization")
	public String cloudSynchronization() {
		// This can be implemented as a cron job
		// TODO: Cloud synchronization logic
		return "Hit cloud synchronization endpoint";
	}

	@PostMapping("/upload")
	public ResponseEntity<String> handleImageUpload(@RequestParam("file") MultipartFile file) {
		// Check if the uploaded file is not empty
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("Please provide a non-empty file");
		}

		// In a real-world application, you might want to save the file to a specific location
		// For simplicity, we just print the file name here
		String fileName = file.getOriginalFilename();
		System.out.println("Received file: " + fileName);

		// You can perform additional processing with the file here

		return ResponseEntity.ok("File uploaded successfully: " + fileName);
	}

	@GetMapping("/images/{imageName}")
	@ResponseBody
	public Resource getImage(@PathVariable String imageName) {
		System.out.println(imageName);
		Resource resource = resourceLoader.getResource("classpath:images/" + imageName);
		return resource;
	}

}
