package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.util.ImageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImagePopulationService {

	@Value("${gallery.images.save-directory}")
	private String SAVE_DIRECTORY;

	public void saveImages(MultipartFile[] images, String saveFolder) {
		for (MultipartFile image : images) {
			try {
				ImageUtil.saveImage(
						image.getOriginalFilename(),
						getImageSavePath(saveFolder),
						image.getBytes()
				);
			} catch (IOException e) {
				throw new RuntimeException("Image bytes could not be read", e);
			}
		}
	}

	private String getImageSavePath(String saveFolder) {
		return SAVE_DIRECTORY + "/" + saveFolder + "/";
	}

}
