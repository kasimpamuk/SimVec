package io.gitlab.group23.simvec.service;

import io.gitlab.group23.simvec.model.SimVecImage;
import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.util.ImageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ImagePopulationService {

	@Value("${gallery.images.save-directory}")
	private String SAVE_DIRECTORY;

	private final UserService userService;

	public ImagePopulationService(UserService userService) {
		this.userService = userService;
	}

	public void saveImages(MultipartFile[] images, SimvecUser simvecUser, List<Long> imageIds) {
		for (int i = 0; i < images.length; i++) {
			saveImageToFolder(images[i], getSaveFolderName(simvecUser));
			simvecUser.addImage(new SimVecImage(imageIds.get(i), simvecUser));
		}
		userService.updateUser(simvecUser);
	}

	private String getImageSavePath(String saveFolder) {
		return SAVE_DIRECTORY + "/" + saveFolder + "/";
	}

	private String getSaveFolderName(SimvecUser simvecUser) {
		return simvecUser.getUserName();
	}

	private void saveImageToFolder(MultipartFile image, String saveFolder) {
		try {
			// Save the image to folder
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
