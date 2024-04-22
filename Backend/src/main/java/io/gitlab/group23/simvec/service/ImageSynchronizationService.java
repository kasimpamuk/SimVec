package io.gitlab.group23.simvec.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageSynchronizationService {

    @Value("${gallery.images.save-directory}")
    private String SAVE_DIRECTORY;

    public List<String> getImages(String username) {
        try {
            Path userFolder = Paths.get(SAVE_DIRECTORY, username);

            return Files.list(userFolder)
                    .filter(Files::isRegularFile)
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .filter(name -> name.endsWith(".jpg") || name.endsWith(".png") || name.endsWith(".gif") || name.endsWith(".jpeg"))
                    .collect(Collectors.toList());

        } catch (NoSuchFileException e) {
            throw new RuntimeException("Folder not found for user: " + username, e);

        } catch (Exception e) {
            throw new RuntimeException("Error retrieving image files for user: " + username, e);
        }
    }
}
