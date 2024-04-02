package io.gitlab.group23.simvec.repository;

import io.gitlab.group23.simvec.model.SimvecUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<SimvecUser, Integer> {
	SimvecUser findSimvecUserByEmailVerificationToken(String emailVerificationToken);

	boolean existsByEmailOrUserName(String email, String userName);

	Optional<SimvecUser> getSimvecUserByUserName(String userName);

	boolean existsByUserName(String userName);

}
