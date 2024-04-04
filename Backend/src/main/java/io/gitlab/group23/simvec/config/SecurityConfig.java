package io.gitlab.group23.simvec.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private static final String PUBLIC_ENDPOINTS = "/api/**";

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.cors(cors -> cors.configurationSource(request -> {
					CorsConfiguration config = new CorsConfiguration();
					config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Adjust as necessary for your frontend
					config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
					config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
					return config;
				}))
				.csrf(AbstractHttpConfigurer::disable) // Disable CSRF for simplicity in APIs
				.authorizeHttpRequests(authz -> authz
						.requestMatchers("/api/**", "/api/public/**").permitAll() // Specify more public endpoints as needed
						.anyRequest().authenticated()
				)
				.httpBasic(httpBasic -> {});

		return http.build();
	}

	@Bean
	public UserDetailsService userDetailsService() {
		PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

		UserDetails user = User.withUsername("user")
				.password(encoder.encode("password"))
				.roles("USER")
				.build();

		return new InMemoryUserDetailsManager(user);
	}

}
