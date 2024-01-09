package io.gitlab.group23.simvec.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class oAuthController {
    // Endpoint for demonstrating the OAuth2 login
    @GetMapping("/loginSuccess")
    public String loginSuccess() {
        // After successful login, redirect to the 'profile' endpoint
        return "redirect:/user/profile";
    }

    // Endpoint for demonstrating how to retrieve user details
    @GetMapping("/profile")
    @ResponseBody
    public String profile(@AuthenticationPrincipal OAuth2User principal) {
        // Return the user's attributes from the OAuth2 provider
        return "Welcome, " + principal.getAttribute("name");
    }

    // Endpoint for secured area
    @GetMapping("/secured")
    @ResponseBody
    @PreAuthorize("isAuthenticated()")
    public String securedArea() {
        // This method is only accessible to authenticated users
        return "This is a secured area.";
    }
}
