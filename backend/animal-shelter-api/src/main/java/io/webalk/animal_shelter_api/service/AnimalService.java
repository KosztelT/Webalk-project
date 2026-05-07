package io.webalk.animal_shelter_api.service;

import io.webalk.animal_shelter_api.dto.AnimalCreateDTO;
import io.webalk.animal_shelter_api.dto.AnimalUpdateDTO;
import io.webalk.animal_shelter_api.enums.Status;
import io.webalk.animal_shelter_api.model.Animal;
import io.webalk.animal_shelter_api.repository.AnimalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;

    public List<Animal> getAllAnimals() {
        return animalRepository.findAll();
    }

    @Transactional
    public Animal createAnimal(AnimalCreateDTO dto) {
        Animal animal = new Animal();
        animal.setName(dto.getName());
        animal.setSpecies(dto.getSpecies());
        animal.setBreed(dto.getBreed());
        animal.setBirthDate(dto.getBirthDate());
        animal.setDescription(dto.getDescription());
        animal.setGender(dto.getGender());

        animal.setStatus(Status.AVAILABLE);

        return animalRepository.save(animal);

    }

    public Animal getAnimalById(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Állat nem található ezzel az ID-val!"));
    }

    public void deleteAnimal(Long id) {
        if (!animalRepository.existsById(id)) {
            throw new RuntimeException("Nem törölhető, ilyen állat nem létezik!");
        }
        animalRepository.deleteById(id);
    }

    @Transactional
    public Animal updateAnimal(Long id, AnimalUpdateDTO dto) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Állat nem található ilyen ID-val"));

        if (dto.getName() != null) animal.setName(dto.getName());
        if (dto.getSpecies() != null) animal.setSpecies(dto.getSpecies());
        if (dto.getBreed() != null) animal.setBreed(dto.getBreed());
        if (dto.getGender() != null) animal.setGender(dto.getGender());
        if (dto.getBirthDate() != null) animal.setBirthDate(dto.getBirthDate());
        if (dto.getDescription() != null) animal.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) animal.setImageUrl(dto.getImageUrl());

        return animalRepository.save(animal);
    }
}
