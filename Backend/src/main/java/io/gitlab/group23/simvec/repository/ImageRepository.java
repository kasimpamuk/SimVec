package io.gitlab.group23.simvec.repository;

import io.gitlab.group23.simvec.model.SimVecImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<SimVecImage, Long> {
	// custom methods...
}
