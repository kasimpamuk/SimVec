package io.gitlab.group23.simvec.util;

import lombok.extern.slf4j.Slf4j;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
public class ImageUtil {

	public static void saveImage(String fileName, String directoryPath, byte[] data) {
		String filePath = Paths.get(directoryPath, fileName).toString();
		log.info("File Path: " + filePath);
		try (FileOutputStream fileOutputStream = new FileOutputStream(filePath)) {
			fileOutputStream.write(data);
		} catch (IOException e) {
			throw new RuntimeException("Image could not be saved");
		}
	}

	public static byte[] getImageData(String imagePath) {
		try {
			return Files.readAllBytes(Path.of(imagePath));
		} catch (Exception e) {
			throw new RuntimeException("Image could not be read");
		}
	}

}
