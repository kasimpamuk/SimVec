package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.service.restservice.RestService;
import io.gitlab.group23.simvec.service.restservice.VectorDatabaseRestService;
import io.gitlab.group23.simvec.util.ImageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class VectorDatabaseService {

	@Value("${vector-database.base-url}")
	private String BASE_URL;

	@Value("${vector-database.endpoints.image-based-search}")
	private String IMAGE_BASED_SEARCH_ENDPOINT;

	@Value("${vector-database.endpoints.text-based-search}")
	private String textBasedSearchEndpoint;

	@Value("${search.image.save-directory}")
	private String SEARCH_IMAGE_SAVE_DIRECTORY;

	private final RestService<String, List<String>> vectorDatabaseRequestService = new VectorDatabaseRestService();

	public List<byte[]> executeImageBasedSearch(MultipartFile image) throws IOException, InterruptedException {
		ImageUtil.saveImage("searched-image.jpeg", SEARCH_IMAGE_SAVE_DIRECTORY, image.getBytes());
		List<String> similarImagePaths = vectorDatabaseRequestService.sendPostRequest(this.getURI(BASE_URL, IMAGE_BASED_SEARCH_ENDPOINT), SEARCH_IMAGE_SAVE_DIRECTORY);
		return this.getAllImages(similarImagePaths);
	}

	public List<String> executeTextBasedSearch(String text) throws IOException, InterruptedException {
		return vectorDatabaseRequestService.sendPostRequest(this.getURI(BASE_URL, textBasedSearchEndpoint), text);
	}

	private URI getURI(String baseUrl, String endpoint) {
		return URI.create(baseUrl + endpoint);
	}

	private List<byte[]> getAllImages(List<String> imagePaths) {
		List<byte[]> images = new ArrayList<>();
		for (int i = 0; i < imagePaths.size(); i++) {
			images.add(getImage(imagePaths.get(i)));
		}
		return images;
	}

	private byte[] getImage(String imagePath) {
		return ImageUtil.getImageData(imagePath);
	}

}
