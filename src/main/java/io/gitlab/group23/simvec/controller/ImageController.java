package io.gitlab.group23.simvec.controller;

import io.gitlab.group23.simvec.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ImageController {

    @Autowired
    private ImageService imageService;

    @GetMapping("/showImage")
    public String showImage(@RequestParam String imagePath, Model model) {
        String imageData = imageService.getImageData(imagePath);
        model.addAttribute("imageData", imageData);
        return "showImage"; // Thymeleaf template name without the ".html" extension
    }
}
