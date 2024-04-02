package io.gitlab.group23.simvec.service.authentication;

import io.gitlab.group23.simvec.model.SimvecUser;
import io.gitlab.group23.simvec.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import static io.gitlab.group23.simvec.util.Constants.*;

@Service
@Slf4j
public class EmailService {

	private final JavaMailSender mailSender;
	private final UserService userService;

	@Autowired
	public EmailService(JavaMailSender mailSender, UserService userService) {
		this.mailSender = mailSender;
		this.userService = userService;
	}

	public void sendVerificationEmail(SimvecUser user, String siteURL) {

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setFrom(COMPANY_EMAIL);
			helper.setTo(user.getEmail());
			helper.setSubject(MAIL_SUBJECT);

			String content = String.format(MAIL_TEMPLATE, user.getUserName(), siteURL, user.getEmailVerificationToken());
			helper.setText(content, true);

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Verification email cannot be send", e);
		}
	}

	public String verifyUserEmail(String token) {
		SimvecUser user = userService.getUserByVerificationToken(token);
		if (user != null) {
			user.setEmailVerified(true);
			user.setEmailVerificationToken(null);
			userService.updateUser(user);
			return "Verification Successful";
		}
		return "Verification Failed";
	}

}
