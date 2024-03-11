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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.csrf(AbstractHttpConfigurer::disable) // Disabling CSRF protection using the new method-based configuration
				.authorizeHttpRequests(authz -> authz
						.requestMatchers("/api/register").permitAll()  // Permit all requests to '/api/register'
						.anyRequest().authenticated()  // Require authentication for any other request
				)
				.httpBasic(httpBasic -> {});  // Enable HTTP Basic Authentication using the new method-based configuration

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
