package io.gitlab.group23.simvec.service.restservice;

import com.google.gson.Gson;
import io.gitlab.group23.simvec.model.VectorDatabaseRequest;
import io.gitlab.group23.simvec.model.VectorDatabaseResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class VectorDatabaseRestService implements RestService<VectorDatabaseRequest, List<String>> {



	@Override
	public List<String> sendGetRequest(URI uri) {
		return null;
	}

	@Override
	public List<String> sendPostRequest(URI uri, VectorDatabaseRequest entity) throws IOException, InterruptedException {

		Gson gson = new Gson();
		String jsonRequest = gson.toJson(entity);

		System.out.println(jsonRequest);

		HttpRequest postRequest = HttpRequest.newBuilder()
				.uri(uri)
				.POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
				.build();

		HttpClient httpClient = HttpClient.newHttpClient();

		HttpResponse<String> postResponse = httpClient.send(postRequest, HttpResponse.BodyHandlers.ofString());
		System.out.println(postResponse.body());

		VectorDatabaseResponse vectorDatabaseResponse = gson.fromJson(postResponse.body(), VectorDatabaseResponse.class);

		System.out.println(vectorDatabaseResponse.getSuccess());

		return List.of("alper");
	}

//	private final RestTemplate restTemplate = new RestTemplate();
//
//	@Override
//	public List<String> sendGetRequest(URI uri) {
//		String[] responses = restTemplate.getForObject(uri, String[].class);
//		if (responses == null) throw new RuntimeException("Cannot receive response in GET request");
//		return List.of(responses);
//	}
//
//	@Override
//	public List<String> sendPostRequest(URI uri, String requestBody) {
//		String[] responses = restTemplate.postForObject(uri, requestBody, String[].class);
//		if (responses == null) throw new RuntimeException("Cannot receive response in POST request");
//		return List.of(responses);
//	}

}
