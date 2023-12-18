package io.gitlab.group23.simvec.service;


import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@Service
public class ImageService {

    public String getImageData(String imagePath) {
        try {
            // Read image data from the file
            byte[] imageBytes = Files.readAllBytes(Path.of(imagePath));
            // Encode the image data to Base64
            String imageData = Base64.getEncoder().encodeToString(imageBytes);
            return imageData;
        } catch (Exception e) {
            // Handle exceptions (e.g., file not found, IOException)
            e.printStackTrace();
            return null;
        }
    }
}
