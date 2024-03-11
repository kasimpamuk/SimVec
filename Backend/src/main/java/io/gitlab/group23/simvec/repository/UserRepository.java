package io.gitlab.group23.simvec.repository;

import io.gitlab.group23.simvec.model.SimvecUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<SimvecUser, Integer> {
	public SimvecUser findSimvecUserByEmailVerificationToken(String emailVerificationToken);

}
