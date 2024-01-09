package io.gitlab.group23.simvec.service;
import io.gitlab.group23.simvec.model.SimvecUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface oAuthUserService {

    SimvecUser saveUser(OAuth2User oAuth2User);

    // Token refreshment will come here
}

