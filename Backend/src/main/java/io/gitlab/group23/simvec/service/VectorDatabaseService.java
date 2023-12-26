package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.service.restservice.RestService;
import io.gitlab.group23.simvec.service.restservice.VectorDatabaseRestService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@Service
public class VectorDatabaseService {

	@Value("${vector-database.base-url}")
	private String baseUrl;

	@Value("${vector-database.endpoints.image-based-search}")
	private String imageBasedSearchEndpoint;

	@Value("${vector-database.endpoints.text-based-search}")
	private String textBasedSearchEndpoint;

	private final RestService<String, List<String>> vectorDatabaseRequestService = new VectorDatabaseRestService();

	public List<String> executeImageBasedSearch(String imagePath) throws IOException, InterruptedException {
		return vectorDatabaseRequestService.sendPostRequest(this.getURI(baseUrl, imageBasedSearchEndpoint), imagePath);
	}

	public List<String> executeTextBasedSearch(String text) throws IOException, InterruptedException {
		return vectorDatabaseRequestService.sendPostRequest(this.getURI(baseUrl, textBasedSearchEndpoint), text);
	}

	private URI getURI(String baseUrl, String endpoint) {
		return URI.create(baseUrl + endpoint);
	}

}
