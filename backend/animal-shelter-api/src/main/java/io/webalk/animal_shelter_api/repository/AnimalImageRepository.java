package io.webalk.animal_shelter_api.repository;

import io.webalk.animal_shelter_api.model.AnimalImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalImageRepository extends JpaRepository<AnimalImage, Long> {
    List<AnimalImage> findByAnimalId(Long animalId);
}
