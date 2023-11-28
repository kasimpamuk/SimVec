package io.gitlab.group23.simvec.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class SimvecController {

	@GetMapping("server-control")
	public String serverControl() {
		return "The server is up.";
	}

	@GetMapping("text-based-search")
	public String textBasedSearch() {
		// TODO: Text based search logic
		return "Hit text based search endpoint";
	}

	@GetMapping("image-based-search")
	public String imageBasedSearch() {
		// TODO: Image based search logic
		return "Hit image based search endpoint";
	}

	@GetMapping("cloud-synchronization")
	public String cloudSynchronization() {
		// This can be implemented as a cron job
		// TODO: Cloud synchronization logic
		return "Hit cloud syncronization endpoint";
	}

}
