package io.gitlab.group23.simvec.model;

import io.gitlab.group23.simvec.service.authentication.passwordvalidation.ValidPassword;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SimvecUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(unique = true)
	private String userName;
	@Column(unique = true)
	private String email;
	@ValidPassword
	private String password;

	private boolean isEmailVerified;
	private String emailVerificationToken;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<SimVecImage> images = new ArrayList<>();

	public void addImage(SimVecImage image) {
		images.add(image);
		image.setUser(this);
	}

	public void removeImage(SimVecImage image) {
		images.remove(image);
		image.setUser(null);
	}

	public List<Long> getImageIds() {
		return images.stream().map(SimVecImage::getId).toList();
	}

}
