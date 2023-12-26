package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.model.SimvecUser;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class Restrequest
{
    public static List<String> sendPostRequest() throws Exception {
        // Set request headers
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("http://localhost:8081/api/image_conversion"))
                .header("Content-Type", "text/plain")
                .POST(HttpRequest.BodyPublishers.ofString("Your plain string content"))
                .build();

        // Create an HttpClient
        HttpClient httpClient = HttpClient.newHttpClient();

        // Send the POST request
        //HttpResponse<SimvecUser> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        // Handle the response as needed
        System.out.println("Response Code: " + response.statusCode());
        System.out.println("Response Body: " + response.body());

        // Optionally, get and print response headers
        HttpHeaders headers = response.headers();
        headers.map().forEach((k, v) -> System.out.println(k + ":" + v));

        // Convert the response body to a List<String>
        return response.body().lines().collect(Collectors.toList());
    }

}
