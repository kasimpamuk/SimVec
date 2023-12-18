package io.gitlab.group23.simvec.model;

import jakarta.persistence.*;
import lombok.*;

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
	@NotEmpty
	private String userName;

	@Column(unique = true)
	@Email
	private String email;

	@NotEmpty
	private String password;

	private boolean deleted = false;


}
