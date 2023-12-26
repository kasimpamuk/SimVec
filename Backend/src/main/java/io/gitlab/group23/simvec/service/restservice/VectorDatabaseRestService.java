package io.gitlab.group23.simvec.service.restservice;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.List;

@Service
public class VectorDatabaseRestService implements RestService<String, List<String>> {

	private final RestTemplate restTemplate = new RestTemplate();

	@Override
	public List<String> sendGetRequest(URI uri) {
		String[] responses = restTemplate.getForObject(uri, String[].class);
		if (responses == null) throw new RuntimeException("Cannot receive response in GET request");
		return List.of(responses);
	}

	@Override
	public List<String> sendPostRequest(URI uri, String requestBody) {
		String[] responses = restTemplate.postForObject(uri, requestBody, String[].class);
		if (responses == null) throw new RuntimeException("Cannot receive response in POST request");
		return List.of(responses);
	}

}
