package io.gitlab.group23.simvec.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IdDifferenceService {

	public List<Integer> getIdDifference(List<Integer> fromIdList, List<Integer> substractedIdList) {
		return fromIdList.stream()
				.filter(id -> !substractedIdList.contains(id))
				.collect(Collectors.toList());
	}

}
