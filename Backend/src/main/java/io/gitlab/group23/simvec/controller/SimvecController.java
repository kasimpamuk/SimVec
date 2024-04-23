package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.model.AuthRequest;
import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.model.VectorDatabaseRequest;
import io.gitlab.group23.simvec.service.*;
import io.gitlab.group23.simvec.service.authentication.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@Slf4j
public class SimvecController {

	private final VectorDatabaseService vectorDatabaseService;
	private final TranslateText translateText;
	private final AuthenticationService authenticationService;
	private final UserService userService;
	private final ImagePopulationService imagePopulationService;
	private final UserInfoService userInfoService;

	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtService jwtService;

	@Autowired
	public SimvecController(VectorDatabaseService vectorDatabaseService, TranslateText translateText, AuthenticationService authenticationService, UserService userService, ImagePopulationService imagePopulationService, UserInfoService userInfoService) {
		this.vectorDatabaseService = vectorDatabaseService;
        this.translateText = translateText;
		this.authenticationService = authenticationService;
		this.userService = userService;
		this.imagePopulationService = imagePopulationService;
		this.userInfoService = userInfoService;
	}

	// ############## JWT ################
	@GetMapping("public-ends/public-endpoint")
	public String publicEndpoint() {
		return "Welcome to public endpoint!";
	}

	@GetMapping("private-ends/private-endpoint")
	public String privateEndpoint() {
		return "Welcome to private endpoint!";
	}

	@PostMapping("public-ends/addNewUser")
	public String addNewUser(@RequestBody SimvecUser userInfo) {
		return userInfoService.addUser(userInfo);
	}

	@GetMapping("/private-ends/userProfile")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public String userProfile() {
		return "Welcome to User Profile";
	}

	@PostMapping("/public-ends/generateToken")
	public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
		System.out.println(authRequest.toString());
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
		System.out.println("Hello");
		if (authentication.isAuthenticated()) {
			System.out.println("in if");
			return jwtService.generateToken(authRequest.getUsername());
		} else {
			System.out.println("in else");
			throw new UsernameNotFoundException("invalid user request !");
		}
	}

	@GetMapping("/public-ends/db")
	public List<SimvecUser> getDb() {
		return userService.getAllUsers();
	}

	// ############## JWT ################

//	@PostMapping("/public-ends/register")
//	public ResponseEntity<SimvecUser> registerUser(@Validated @RequestBody SimvecUser simvecUser) {
//		//System.out.println("hello");
//		return ResponseEntity.ok(authenticationService.registerUser(simvecUser));
//	}

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
		System.out.println("Text Based Search Endpoint");
		// String translatedText = translateText.translateText("hidden-marker-416811" , "en", vectorDatabaseRequest.getInput());
		// vectorDatabaseRequest.setInput(translatedText);
		List<byte[]> images = vectorDatabaseService.executeTextBasedSearch(vectorDatabaseRequest);
		return ResponseEntity.ok(images);
	}

//	@GetMapping("/verify")
//	public String verifyUser(@RequestParam("code") String token) {
//		return authenticationService.verifyUserEmail(token);
//	}

	@PostMapping("/transfer-images")
	public ResponseEntity<?> transferImages(@RequestParam("images") MultipartFile[] images, @RequestParam String username) {
//		SimvecUser user = userService.getUserByUsername(username);
		imagePopulationService.saveImages(images, "alper");
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Images are saved successfully");
	}


}
